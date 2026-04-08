import type { Board, Session } from '@/core/types'
import { getSessionTitle, getRelativeDate } from '@/core/session'

interface SidebarProps {
  board: Board
  sessions: Session[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onManageBoard: () => void
}

export function Sidebar({
  board,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onManageBoard,
}: SidebarProps) {
  return (
    <aside className="w-[220px] min-w-[220px] h-full bg-sidebar flex flex-col border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-7 h-7 bg-white rounded-[5px] flex items-center justify-center text-sm">
          🏛️
        </div>
        <span className="text-[14px] font-semibold text-text-primary tracking-tight">
          Symposion
        </span>
      </div>

      {/* Members */}
      <div className="px-4 mt-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
          Members
        </div>
        <div className="flex flex-col gap-0.5">
          {board.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2.5 py-1.5 px-1"
            >
              <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-[12px] shrink-0">
                {member.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] text-text-secondary truncate">
                  {member.name}
                </div>
                {member.role && (
                  <div className="text-[10px] text-text-ghost truncate">
                    {member.role}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Manage board */}
        <button
          onClick={onManageBoard}
          className="flex items-center gap-2.5 py-1.5 px-1 mt-1 w-full text-left group"
        >
          <div className="w-6 h-6 rounded-full border border-dashed border-text-muted flex items-center justify-center text-[12px] text-text-muted group-hover:border-text-secondary transition-colors">
            +
          </div>
          <span className="text-[12px] text-text-muted group-hover:text-text-secondary transition-colors">
            Manage board
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 my-3 border-t border-border" />

      {/* Recent sessions */}
      <div className="px-4 flex-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
          Recent
        </div>
        <div className="flex flex-col gap-0.5">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`text-left px-2 py-1.5 rounded-button transition-colors ${
                session.id === activeSessionId
                  ? 'bg-border text-text-primary'
                  : 'text-text-secondary hover:bg-border/50'
              }`}
            >
              <div className="text-[12px] truncate">
                {getSessionTitle(session)}
              </div>
              <div className="text-[10px] text-text-ghost">
                {getRelativeDate(session.date)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New session button */}
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full py-2.5 bg-white text-black text-[13px] font-medium rounded-button hover:bg-white/90 transition-colors"
        >
          + New session
        </button>
      </div>
    </aside>
  )
}
