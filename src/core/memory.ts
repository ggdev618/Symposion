import type { Member, Session, Memory, DialogueLine } from './types'
import { callAnthropic, parseJsonResponse } from './api'
import {
  buildMemoryCompressionPrompt,
  buildMemoryCondensationPrompt,
  type MemoryCompressionResponse,
  type MemoryCondensationResponse,
} from './prompts'

/**
 * Run memory compression for each member after a session completes.
 * Extracts what each member said and compresses it into a memory entry.
 * Silent — never blocks the UI.
 */
export async function compressSessionMemories(
  session: Session,
  members: Member[],
  apiKey: string,
  onMemberUpdated: (member: Member) => void
): Promise<void> {
  // Find the question (first user message)
  const question =
    session.messages.find((m) => m.role === 'user')?.content ?? 'Unknown'

  // Find all dialogue lines
  const allDialogue: DialogueLine[] = session.messages.flatMap(
    (m) => m.dialogue ?? []
  )

  for (const member of members) {
    try {
      // Get this member's lines
      const memberLines = allDialogue
        .filter((d) => d.memberId === member.id)
        .map((d) => d.text)
        .join(' ')

      if (!memberLines) continue // Member didn't speak

      // Get their final vote
      const lastLine = [...allDialogue]
        .reverse()
        .find((d) => d.memberId === member.id)
      const finalVote = lastLine?.finalVote ?? 'n/a'

      const { system, user } = buildMemoryCompressionPrompt(
        member.name,
        question,
        memberLines,
        finalVote
      )

      const raw = await callAnthropic(apiKey, system, user)
      const result = parseJsonResponse<MemoryCompressionResponse>(raw)

      const memory: Memory = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        question,
        sessionId: session.id,
        position: result.position,
        reasoning: result.reasoning,
      }

      const updatedMember: Member = {
        ...member,
        memories: [...member.memories, memory],
      }

      onMemberUpdated(updatedMember)
    } catch (err) {
      console.error(`Memory compression failed for ${member.name}:`, err)
      // Silent failure — continue with other members
    }
  }
}

/**
 * Check if a member's memories need condensation (triggered at 20 entries).
 * Takes older memories beyond the most recent 10, merges with existing
 * condensedMemory, and produces a new summary.
 */
export async function maybeCondenseMemories(
  member: Member,
  apiKey: string
): Promise<Member | null> {
  if (member.memories.length < 20) return null

  try {
    const recentCount = 10
    const olderMemories = member.memories.slice(0, -recentCount)
    const recentMemories = member.memories.slice(-recentCount)

    const { system, user } = buildMemoryCondensationPrompt(
      member.name,
      member.condensedMemory,
      olderMemories.map((m) => ({
        question: m.question,
        position: m.position,
        reasoning: m.reasoning,
      }))
    )

    const raw = await callAnthropic(apiKey, system, user)
    const result = parseJsonResponse<MemoryCondensationResponse>(raw)

    return {
      ...member,
      condensedMemory: result.condensedMemory,
      memories: recentMemories,
    }
  } catch (err) {
    console.error(`Memory condensation failed for ${member.name}:`, err)
    return null // Fail silently, retry after next session
  }
}

/**
 * Run condensation for all members who need it.
 */
export async function runCondensationPass(
  members: Member[],
  apiKey: string,
  onMemberUpdated: (member: Member) => void
): Promise<void> {
  for (const member of members) {
    const condensed = await maybeCondenseMemories(member, apiKey)
    if (condensed) {
      onMemberUpdated(condensed)
    }
  }
}
