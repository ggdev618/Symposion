import { useState } from 'react'
import type { Board, Session as _Session } from '@/core/types'

interface NewSessionScreenProps {
  board: Board
  sessions: _Session[]
  onStartSession: (type: 'open' | 'listen', question?: string) => void
  loading?: boolean
}

export function NewSessionScreen({ board, sessions, onStartSession, loading }: NewSessionScreenProps) {
  const [sessionType, setSessionType] = useState<'open' | 'listen' | null>(null)
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (loading) return

    if (sessionType === 'listen') {
      onStartSession('listen')
      setSessionType(null)
      return
    }

    if (!input.trim()) return
    onStartSession('open', input.trim())
    setInput('')
    setSessionType(null)
  }

  const handleListenClick = () => {
    setSessionType('listen')
    // If "Just listen" is already selected and clicked again, start it
    if (sessionType === 'listen') {
      onStartSession('listen')
      setSessionType(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const tooFewSessions = sessions.length < 5

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-12 px-8">
      {/* Header area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl">
        {/* Member avatar stack */}
        <div className="flex -space-x-2 mb-6">
          {board.members.map((member) => (
            <div
              key={member.id}
              className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-[16px] border-2 border-bg"
            >
              {member.emoji}
            </div>
          ))}
        </div>

        {/* Heading */}
        <h1 className="text-[20px] font-medium text-text-primary text-center leading-tight mb-8">
          What are you bringing
          <br />
          to the board today?
        </h1>

        {/* Session type cards */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          <button
            onClick={() => setSessionType('open')}
            disabled={loading}
            className={`p-4 rounded-card border text-left transition-all ${
              sessionType === 'open'
                ? 'border-border-hover bg-card'
                : 'border-border bg-card/50 hover:border-border-hover'
            }`}
          >
            <div className="text-[20px] mb-2">💬</div>
            <div className="text-[13px] font-medium text-text-primary mb-1">
              Open session
            </div>
            <div className="text-[11px] text-text-muted leading-relaxed">
              Ask anything. The board debates and responds.
            </div>
          </button>

          <button
            onClick={handleListenClick}
            disabled={loading}
            className={`p-4 rounded-card border text-left transition-all relative ${
              sessionType === 'listen'
                ? 'border-border-hover bg-card'
                : 'border-border bg-card/50 hover:border-border-hover'
            }`}
          >
            <div className="text-[20px] mb-2">🔇</div>
            <div className="text-[13px] font-medium text-text-primary mb-1">
              Just listen
            </div>
            <div className="text-[11px] text-text-muted leading-relaxed">
              Say nothing. The board talks among themselves about you.
            </div>
            {tooFewSessions && sessionType === 'listen' && (
              <div className="mt-2 text-[10px] text-accent-no leading-relaxed">
                Come back after a few more sessions. The board needs to know you first.
              </div>
            )}
          </button>
        </div>

        {/* Empty board warning */}
        {board.members.length === 0 && (
          <div className="mt-4 text-[12px] text-accent-no">
            Add members to your board before starting a session.
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="w-full max-w-2xl mt-8">
        <div className="relative flex items-end bg-[#1a1a1a] border border-border rounded-card">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Describe a decision, plan, or situation…"
            rows={2}
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-ghost px-4 py-3 resize-none outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="m-2 w-9 h-9 flex items-center justify-center bg-white text-black rounded-button disabled:opacity-30 hover:bg-white/90 transition-all shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <span className="text-[16px]">&rarr;</span>
            )}
          </button>
        </div>
        <div className="text-[11px] text-text-ghost text-center mt-2">
          Pressure test and steelman are available once inside a session.
        </div>
      </div>
    </div>
  )
}
