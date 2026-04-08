import { useState, useRef, useEffect } from 'react'
import type { Session, Board, Message, Member, Guest } from '@/core/types'
import { getSessionTitle } from '@/core/session'
import { TensionMap } from '@/components/TensionMap'
import { LoadingDialogue } from '@/components/LoadingDialogue'
import { Settings, Download, X } from 'lucide-react'

interface ActiveSessionScreenProps {
  session: Session
  board: Board
  loading?: boolean
  error?: string | null
  activeGuest?: Guest | null
  onDismissGuest?: () => void
  onFollowUp?: (text: string) => void
  onOpenSettings?: () => void
  onClearError?: () => void
}

export function ActiveSessionScreen({
  session,
  board,
  loading,
  error,
  activeGuest,
  onDismissGuest,
  onFollowUp,
  onOpenSettings,
  onClearError,
}: ActiveSessionScreenProps) {
  const title = getSessionTitle(session)
  const [followUp, setFollowUp] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const memberMap = Object.fromEntries(
    board.members.map((m) => [m.id, m])
  )

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [session.messages.length, loading])

  const handleFollowUp = () => {
    if (!followUp.trim() || !onFollowUp || loading) return
    onFollowUp(followUp.trim())
    setFollowUp('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFollowUp()
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
        <div className="text-[13px] text-text-muted truncate max-w-[50%]">
          {title}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-[12px] text-text-secondary border border-border rounded-button hover:border-border-hover transition-colors flex items-center gap-1.5">
            <Download size={12} />
            Export
          </button>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 text-[12px] text-text-secondary border border-border rounded-button hover:border-border-hover transition-colors flex items-center gap-1.5"
          >
            <Settings size={12} />
            Settings
          </button>
        </div>
      </div>

      {/* Member chips */}
      <div className="flex gap-2 px-6 py-3 border-b border-border shrink-0 overflow-x-auto">
        {board.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill border border-border text-[12px] text-text-secondary whitespace-nowrap"
          >
            <span className="text-[11px]">{member.emoji}</span>
            {member.name}
          </div>
        ))}
      </div>

      {/* Session body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        {/* Listen mode header */}
        {session.type === 'listen' && (
          <div className="mb-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-ghost mb-1">
              They don't know you're reading this
            </div>
          </div>
        )}

        {session.messages.map((message) => (
          <MessageBlock
            key={message.id}
            message={message}
            memberMap={memberMap}
            members={board.members}
            isListenMode={session.type === 'listen'}
            activeGuest={activeGuest}
            onDismissGuest={onDismissGuest}
          />
        ))}

        {/* Loading state */}
        {loading && (
          <div className="mb-6">
            {session.type === 'listen' ? (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent-yes animate-pulse" />
                <span className="text-[12px] text-text-muted">Still listening</span>
              </div>
            ) : null}
            <LoadingDialogue memberCount={board.members.length} />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 p-3 rounded-card border border-accent-no/20 bg-accent-no/[0.05]">
            <div className="flex items-start justify-between gap-2">
              <div className="text-[13px] text-accent-no">{error}</div>
              {onClearError && (
                <button
                  onClick={onClearError}
                  className="text-accent-no/60 hover:text-accent-no shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input bar — only for open sessions */}
      {session.type === 'open' && (
        <div className="px-6 py-4 border-t border-border shrink-0">
          <div className="relative flex items-end bg-[#1a1a1a] border border-border rounded-card">
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Follow up, push back, or ask something new…"
              rows={2}
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-ghost px-4 py-3 resize-none outline-none disabled:opacity-50"
            />
            <button
              onClick={handleFollowUp}
              disabled={!followUp.trim() || loading}
              className="m-2 w-9 h-9 flex items-center justify-center bg-white text-black rounded-button disabled:opacity-30 hover:bg-white/90 transition-all shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <span className="text-[16px]">&rarr;</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Message Block ──────────────────────────────────────

function MessageBlock({
  message,
  memberMap,
  members,
  isListenMode,
  activeGuest,
  onDismissGuest,
}: {
  message: Message
  memberMap: Record<string, Member>
  members: Member[]
  isListenMode?: boolean
  activeGuest?: Guest | null
  onDismissGuest?: () => void
}) {
  if (message.role === 'user') {
    // Follow-up messages are right-aligned bubbles (not the first question)
    const isFollowUp = true // Any user message in active session context
    return (
      <div className="mb-6">
        <div className={`${isFollowUp ? '' : ''}`}>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            Question
          </div>
          <div className="text-[15px] text-text-primary leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  // Board message with dialogue
  return (
    <div className="mb-6">
      {message.dialogue && (
        <div className="border border-border rounded-card overflow-hidden">
          {message.dialogue.map((line, i) => {
            const member = memberMap[line.memberId]
            const isDevilsAdvocate = line.memberId === 'devil'
            const isGuest =
              activeGuest && !member && !isDevilsAdvocate

            // Check if this is the first time this member speaks in this dialogue
            const isFirst =
              message.dialogue!.findIndex(
                (d) => d.memberId === line.memberId
              ) === i

            // Get display info
            let displayEmoji = member?.emoji ?? '❓'
            let displayName = member?.name ?? line.memberId

            if (isDevilsAdvocate) {
              displayEmoji = '⚖️'
              displayName = "Devil's advocate"
            } else if (isGuest && activeGuest) {
              displayEmoji = activeGuest.emoji
              displayName = activeGuest.name
            }

            return (
              <div key={i}>
                {i > 0 && <div className="border-t border-[#1a1a1a]" />}
                <div className="px-4 py-3">
                  {/* Guest summoned-by label */}
                  {isGuest && isFirst && activeGuest && (
                    <div className="text-[10px] text-text-ghost italic mb-1.5">
                      summoned by{' '}
                      {memberMap[activeGuest.nominatedBy]?.name ??
                        activeGuest.nominatedBy}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[13px]">{displayEmoji}</span>
                      <span
                        className={`text-[13px] ${
                          isFirst ? 'font-semibold' : ''
                        } ${
                          isDevilsAdvocate
                            ? 'text-text-muted italic'
                            : 'text-text-primary'
                        }`}
                      >
                        {displayName}
                      </span>
                      {/* Vote badge — only on last line, not in listen mode */}
                      {line.finalVote && !isListenMode && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-pill ${
                            line.finalVote === 'yes'
                              ? 'bg-accent-yes/[0.08] text-accent-yes border border-accent-yes/[0.12]'
                              : line.finalVote === 'no'
                                ? 'bg-accent-no/[0.08] text-accent-no border border-accent-no/[0.12]'
                                : 'bg-white/[0.04] text-text-muted border border-border'
                          }`}
                        >
                          {line.finalVote.charAt(0).toUpperCase() +
                            line.finalVote.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Guest dismiss button */}
                    {isGuest && onDismissGuest && (
                      <button
                        onClick={onDismissGuest}
                        className="text-text-ghost hover:text-text-muted transition-colors shrink-0"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="text-[13px] text-text-secondary leading-relaxed mt-1.5 ml-[29px]">
                    {line.text}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tension map */}
      {message.tensionMap && !isListenMode && (
        <TensionMap tensionMap={message.tensionMap} members={members} />
      )}

      {/* Verdict */}
      {message.verdict && !isListenMode && (
        <div className="mt-4 pl-4 border-l-2 border-border-hover">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
            Verdict
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            {message.verdict}
          </div>
        </div>
      )}
    </div>
  )
}
