import { useState, useCallback } from 'react'
import type { Board, Session, Guest } from '@/core/types'
import { callAnthropic, callAnthropicWithHistory, parseJsonResponse } from '@/core/api'
import {
  buildOpenSessionPrompt,
  buildFollowUpPrompt,
  buildListenPrompt,
  buildSessionSummary,
  buildAutoFillPrompt,
  type OpenSessionResponse,
  type ListenSessionResponse,
  type AutoFillResponse,
} from '@/core/prompts'
import { compressSessionMemories, runCondensationPass } from '@/core/memory'
import { createBoardMessage } from '@/core/session'

interface UseSessionOptions {
  apiKey: string | null
  board: Board
  sessions: Session[]
  onMemberUpdated: (memberId: string, updates: Partial<import('@/core/types').Member>) => void
}

export function useSession({ apiKey, board, sessions, onMemberUpdated }: UseSessionOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null)

  const dismissGuest = useCallback(() => {
    setActiveGuest(null)
  }, [])

  /**
   * Run the initial open session — sends question, gets full board response
   */
  const runOpenSession = useCallback(
    async (session: Session): Promise<Session | null> => {
      if (!apiKey) {
        setError('API key not set. Open Settings to add your Anthropic API key.')
        return null
      }

      const question = session.messages.find((m) => m.role === 'user')?.content
      if (!question) return null

      setLoading(true)
      setError(null)

      try {
        const { system, user } = buildOpenSessionPrompt(board, question)
        const raw = await callAnthropic(apiKey, system, user)
        const result = parseJsonResponse<OpenSessionResponse>(raw)

        if (result.guest) {
          setActiveGuest(result.guest)
        }

        const boardMessage = createBoardMessage(
          '', // content not used when dialogue exists
          result.dialogue,
          result.verdict,
          result.tensionMap,
          result.questionType
        )

        const updatedSession: Session = {
          ...session,
          messages: [...session.messages, boardMessage],
          verdict: result.verdict,
          tensionMap: result.tensionMap,
        }

        // Silently compress memories in the background
        compressSessionMemories(updatedSession, board.members, apiKey, (updated) => {
          onMemberUpdated(updated.id, {
            memories: updated.memories,
          })
        }).then(() => {
          // After compression, check for condensation
          runCondensationPass(board.members, apiKey, (updated) => {
            onMemberUpdated(updated.id, {
              condensedMemory: updated.condensedMemory,
              memories: updated.memories,
            })
          })
        })

        return updatedSession
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)

        // Retry once on JSON parse failure
        if (msg.includes('JSON') || msg.includes('parse')) {
          try {
            const { system, user } = buildOpenSessionPrompt(board, question)
            const raw = await callAnthropic(apiKey, system, user)
            const result = parseJsonResponse<OpenSessionResponse>(raw)

            const boardMessage = createBoardMessage(
              '',
              result.dialogue,
              result.verdict,
              result.tensionMap,
              result.questionType
            )

            const updatedSession: Session = {
              ...session,
              messages: [...session.messages, boardMessage],
              verdict: result.verdict,
              tensionMap: result.tensionMap,
            }

            setError(null)
            return updatedSession
          } catch {
            // Second failure — keep the error
          }
        }

        return null
      } finally {
        setLoading(false)
      }
    },
    [apiKey, board, onMemberUpdated]
  )

  /**
   * Send a follow-up message in an existing session
   */
  const runFollowUp = useCallback(
    async (session: Session, followUpText: string): Promise<Session | null> => {
      if (!apiKey) {
        setError('API key not set.')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const { system, user } = buildFollowUpPrompt(board, session, followUpText)

        // Build message history for the API
        const history: { role: 'user' | 'assistant'; content: string }[] = []
        for (const msg of session.messages) {
          if (msg.role === 'user') {
            history.push({ role: 'user', content: msg.content })
          } else if (msg.dialogue) {
            const dialogueText = msg.dialogue
              .map((d) => {
                const member = board.members.find((m) => m.id === d.memberId)
                return `${member?.name ?? d.memberId}: ${d.text}`
              })
              .join('\n')
            history.push({
              role: 'assistant',
              content: JSON.stringify({
                dialogue: msg.dialogue,
                verdict: msg.verdict,
                tensionMap: msg.tensionMap,
              }),
            })
            void dialogueText // used in prompt construction
          }
        }

        const raw = await callAnthropicWithHistory(apiKey, system, [
          ...history,
          { role: 'user', content: user },
        ])
        const result = parseJsonResponse<OpenSessionResponse>(raw)

        if (result.guest) {
          setActiveGuest(result.guest)
        }

        const boardMessage = createBoardMessage(
          '',
          result.dialogue,
          result.verdict,
          result.tensionMap,
          result.questionType
        )

        return {
          ...session,
          messages: [...session.messages, boardMessage],
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiKey, board]
  )

  /**
   * Run a "just listen" session
   */
  const runListenSession = useCallback(
    async (): Promise<Session | null> => {
      if (!apiKey) {
        setError('API key not set.')
        return null
      }

      if (sessions.length < 5) {
        setError('Come back after a few more sessions. The board needs to know you first.')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const summary = buildSessionSummary(sessions, board)
        const { system, user } = buildListenPrompt(board, summary, sessions.length)
        const raw = await callAnthropic(apiKey, system, user)
        const result = parseJsonResponse<ListenSessionResponse>(raw)

        const listenSession: Session = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          type: 'listen',
          messages: [
            {
              id: crypto.randomUUID(),
              role: 'board',
              content: '',
              dialogue: result.dialogue,
            },
          ],
          boardSnapshot: board.members.map(({ id, name, emoji, role }) => ({ id, name, emoji, role })),
        }

        return listenSession
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiKey, board, sessions]
  )

  /**
   * Auto-fill a member profile from a description
   */
  const autoFillMember = useCallback(
    async (description: string): Promise<AutoFillResponse | null> => {
      if (!apiKey) {
        setError('API key not set.')
        return null
      }

      try {
        const { system, user } = buildAutoFillPrompt(description)
        const raw = await callAnthropic(apiKey, system, user)
        return parseJsonResponse<AutoFillResponse>(raw)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return null
      }
    },
    [apiKey]
  )

  return {
    loading,
    error,
    activeGuest,
    dismissGuest,
    runOpenSession,
    runFollowUp,
    runListenSession,
    autoFillMember,
    clearError: () => setError(null),
  }
}
