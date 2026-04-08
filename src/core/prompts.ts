import type { Member, Board, Session, DialogueLine, Guest, TensionMap } from './types'

// ─── Helpers ────────────────────────────────────────────

function formatMemberContext(member: Member): string {
  let ctx = `- ${member.name} (${member.role}): ${member.personality}`

  if (member.condensedMemory) {
    ctx += `\n  Long-term observations: ${member.condensedMemory}`
  }

  if (member.memories.length > 0) {
    const recent = member.memories.slice(-10)
    const memoryLines = recent
      .map((m) => `    - [${m.date}] Q: "${m.question}" → ${m.position}`)
      .join('\n')
    ctx += `\n  Recent sessions:\n${memoryLines}`
  }

  return ctx
}

function buildBoardContext(board: Board): string {
  const memberBlocks = board.members.map(formatMemberContext).join('\n\n')
  let context = `Board members:\n${memberBlocks}`

  if (board.devilsAdvocate) {
    context += `\n\nThere is also a permanent Devil's Advocate seat. This character always argues against whatever position the majority is taking, regardless of their own views. They have no fixed personality — their only role is structural opposition. Use memberId "devil".`
  }

  return context
}

function buildConversationHistory(session: Session, board: Board): string {
  return session.messages
    .map((msg) => {
      if (msg.role === 'user') {
        return `User: "${msg.content}"`
      }
      if (msg.dialogue) {
        const memberMap = Object.fromEntries(board.members.map((m) => [m.id, m]))
        const lines = msg.dialogue
          .map((d) => {
            const name = memberMap[d.memberId]?.name ?? d.memberId
            return `${name}: ${d.text}`
          })
          .join('\n')
        return `Board discussion:\n${lines}${msg.verdict ? `\nVerdict: ${msg.verdict}` : ''}`
      }
      return `Board: ${msg.content}`
    })
    .join('\n\n')
}

// ─── Open Session Prompt ────────────────────────────────

export interface OpenSessionResponse {
  dialogue: DialogueLine[]
  verdict: string
  tensionMap: TensionMap
  guest: Guest | null
}

export function buildOpenSessionPrompt(
  board: Board,
  question: string,
  context?: string,
  conversationHistory?: string
): { system: string; user: string } {
  const boardContext = buildBoardContext(board)

  const system = `You are facilitating a board session for a user seeking counsel.

${boardContext}

Generate a natural board debate as a flowing dialogue. Instructions:
- Members react to each other directly, not just to the question
- Members speak more than once where natural — interrupt, concede, dig in
- Each member's personality and history shapes how they argue, not just what they conclude
- Members reference past positions when genuinely relevant, without announcing they are doing so
- The dialogue should feel like a real heated meeting, not a survey of opinions
- Include finalVote on each member's last line only
- Determine whether an outside guest voice would genuinely add value for this specific question. Only include a guest if there is a real gap — most sessions should return null
- Identify named fault lines from the actual argument, not generic categories
${board.devilsAdvocate ? '- The Devil\'s Advocate (memberId "devil") must always argue against whatever position the majority is taking' : ''}

Return only valid JSON — no markdown, no backticks, no preamble:
{
  "dialogue": [
    { "memberId": "...", "text": "...", "finalVote": "yes" | "no" | "abstain" | null }
  ],
  "verdict": "...",
  "tensionMap": {
    "clusters": [{ "memberIds": [...], "position": "..." }],
    "faultLines": [{ "name": "...", "sides": [{ "memberIds": [...], "position": "..." }], "splitRatio": "3 vs 2" }]
  },
  "guest": {
    "name": "...", "emoji": "...", "role": "...", "personality": "...",
    "nominatedBy": "memberId", "reason": "..."
  } | null
}`

  let userMsg = `The user's question or situation: "${question}"`
  if (context) {
    userMsg += `\nAdditional context: "${context}"`
  }
  if (conversationHistory) {
    userMsg = `Previous conversation:\n${conversationHistory}\n\nThe user's follow-up: "${question}"`
  }

  return { system, user: userMsg }
}

// ─── Follow-up Prompt ────────────────────────────────

export function buildFollowUpPrompt(
  board: Board,
  session: Session,
  followUp: string
): { system: string; user: string } {
  const history = buildConversationHistory(session, board)
  return buildOpenSessionPrompt(board, followUp, undefined, history)
}

// ─── Just Listen Prompt ─────────────────────────────────

export interface ListenSessionResponse {
  dialogue: DialogueLine[]
}

export function buildListenPrompt(
  board: Board,
  sessionSummary: string,
  sessionCount: number
): { system: string; user: string } {
  const memberList = board.members
    .map((m) => `- ${m.name} (${m.role}): ${m.personality}`)
    .join('\n')

  const system = `You are a fly on the wall. This board is having a candid conversation about the person who consults them. The person is not present.

Board members:
${memberList}

Have a genuine in-character conversation about this person. Discuss:
- Patterns in what they bring to you
- What they never ask about
- What you think they are actually afraid of
- What the pattern of questions reveals about their priorities

Be direct and candid. They chose to say nothing today — respond to that choice.
Members should react to and build on each other's observations.

Return only valid JSON — no markdown, no backticks, no preamble:
{ "dialogue": [{ "memberId": "...", "text": "..." }] }`

  const user = `What is known about this person from ${sessionCount} past sessions:\n${sessionSummary}`

  return { system, user }
}

// ─── Memory Compression Prompt ──────────────────────────

export interface MemoryCompressionResponse {
  position: string
  reasoning: string
}

export function buildMemoryCompressionPrompt(
  memberName: string,
  question: string,
  memberLines: string,
  finalVote: string
): { system: string; user: string } {
  const system = `A board session just completed. Compress this member's contribution into a memory entry.

Write a 1-2 sentence memory in third person present tense capturing: what was asked, what position they took, the core of their reasoning. Be specific, not generic. This memory will be injected into future sessions as actionable context.

Return only valid JSON — no markdown, no backticks, no preamble:
{ "position": "...", "reasoning": "..." }`

  const user = `Member: ${memberName}
Question: "${question}"
Their lines from the dialogue: "${memberLines}"
Their final vote: ${finalVote}`

  return { system, user }
}

// ─── Memory Condensation Prompt ─────────────────────────

export interface MemoryCondensationResponse {
  condensedMemory: string
}

export function buildMemoryCondensationPrompt(
  memberName: string,
  existingCondensed: string | undefined,
  memories: { question: string; position: string; reasoning: string }[]
): { system: string; user: string } {
  const memoryList = memories
    .map((m, i) => `${i + 1}. Q: "${m.question}" → ${m.position} (${m.reasoning})`)
    .join('\n')

  const system = `Rewrite the long-term summary to incorporate these observations. Capture:
- Recurring patterns in what this person brings to the board
- Positions this member has consistently taken with this user
- Any predictions made that were later confirmed or relevant follow-ups
- Persistent truths about this user that have emerged over time

Write in third person present tense. Be specific — generic observations are useless. This summary will be injected into every future session as background context so it must earn its place.

Return only valid JSON — no markdown, no backticks, no preamble:
{ "condensedMemory": "..." }`

  const user = `${memberName} has been observing this user across many sessions. Here is their existing long-term summary (if any):
${existingCondensed || 'None yet'}

Here are the older session memories to be absorbed into the summary:
${memoryList}`

  return { system, user }
}

// ─── Auto-fill Prompt ───────────────────────────────────

export interface AutoFillResponse {
  name: string
  emoji: string
  role: string
  personality: string
}

export function buildAutoFillPrompt(
  description: string
): { system: string; user: string } {
  const system = `Generate a board member profile for a personal advisory board.

The personality field must be behaviorally specific — describe how this character argues, what they prioritize, how they make decisions, what they dismiss, how they treat opposing views. Write in third person present tense. Do not describe who they are historically. Describe how they behave in a heated debate.

Return only valid JSON — no markdown, no backticks, no preamble:
{ "name": "...", "emoji": "...", "role": "...", "personality": "..." }`

  const user = `Generate a board member profile for: "${description}"`

  return { system, user }
}

// ─── Session Summary for Listen Mode ────────────────────

export function buildSessionSummary(sessions: Session[], board: Board): string {
  if (sessions.length === 0) return 'No sessions yet.'

  const recentSessions = sessions.slice(0, 20) // Last 20 sessions
  const memberMap = Object.fromEntries(board.members.map((m) => [m.id, m]))

  const summaries = recentSessions.map((session) => {
    const userMsgs = session.messages.filter((m) => m.role === 'user')
    const topics = userMsgs.map((m) => m.content).join('; ')
    const verdict = session.verdict ?? session.messages.find((m) => m.verdict)?.verdict

    let voteBreakdown = ''
    const boardMsg = session.messages.find((m) => m.dialogue)
    if (boardMsg?.dialogue) {
      const votes = boardMsg.dialogue
        .filter((d) => d.finalVote)
        .map((d) => `${memberMap[d.memberId]?.name ?? d.memberId}: ${d.finalVote}`)
      if (votes.length) voteBreakdown = ` | Votes: ${votes.join(', ')}`
    }

    return `- [${session.date}] Topic: "${topics}"${verdict ? ` → Verdict: ${verdict}` : ''}${voteBreakdown}`
  })

  return summaries.join('\n')
}
