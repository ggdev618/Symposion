import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import type { Board } from '@/core/types'
import { SUGGESTED_MEMBERS, MAX_BOARD_MEMBERS } from '@/core/board'

interface ManageBoardPanelProps {
  board: Board
  isOpen: boolean
  onClose: () => void
  onUpdateBoard: (board: Board) => void
  onAddMember: () => void
  onAddSuggestion: (name: string) => void
}

export function ManageBoardPanel({
  board,
  isOpen,
  onClose,
  onUpdateBoard,
  onAddMember,
  onAddSuggestion,
}: ManageBoardPanelProps) {
  const removeMember = (memberId: string) => {
    onUpdateBoard({
      ...board,
      members: board.members.filter((m) => m.id !== memberId),
    })
  }

  const toggleDevilsAdvocate = () => {
    onUpdateBoard({
      ...board,
      devilsAdvocate: !board.devilsAdvocate,
    })
  }

  const isFull = board.members.length >= MAX_BOARD_MEMBERS

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-sidebar border-l border-border z-50 flex flex-col transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <h2 className="text-[15px] font-semibold text-text-primary">
            Your board
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-button text-text-muted hover:text-text-secondary hover:bg-border transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Member grid */}
          <div className="grid grid-cols-2 gap-3">
            {board.members.map((member) => (
              <div
                key={member.id}
                className="relative p-3 bg-card border border-border rounded-card group"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeMember(member.id)}
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-text-ghost hover:text-text-secondary hover:bg-border transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>

                {/* Emoji */}
                <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-[16px] mb-2">
                  {member.emoji}
                </div>

                {/* Name & role */}
                <div className="text-[13px] font-medium text-text-primary truncate">
                  {member.name}
                </div>
                <div className="text-[11px] text-text-muted truncate">
                  {member.role}
                </div>

                {/* Personality snippet */}
                <div className="text-[11px] text-text-ghost leading-relaxed mt-1.5 line-clamp-2">
                  {member.personality}
                </div>
              </div>
            ))}

            {/* Add member card */}
            {!isFull && (
              <button
                onClick={onAddMember}
                className="p-3 border border-dashed border-text-muted rounded-card flex flex-col items-center justify-center gap-2 min-h-[120px] hover:border-text-secondary transition-colors group"
              >
                <div className="w-9 h-9 rounded-full border border-dashed border-text-muted flex items-center justify-center text-[16px] text-text-muted group-hover:border-text-secondary group-hover:text-text-secondary transition-colors">
                  +
                </div>
                <span className="text-[12px] text-text-muted group-hover:text-text-secondary transition-colors">
                  Add member
                </span>
              </button>
            )}
          </div>

          {/* Board full note */}
          {isFull && (
            <div className="text-[11px] text-text-muted mt-3">
              Board is full ({MAX_BOARD_MEMBERS}/{MAX_BOARD_MEMBERS}). Remove a member to add someone new.
            </div>
          )}

          {/* Devil's advocate toggle */}
          <div className="flex items-center justify-between mt-6 py-3 border-t border-border">
            <label
              htmlFor="devils-advocate"
              className="text-[13px] text-text-secondary cursor-pointer"
            >
              Devil's advocate seat
            </label>
            <Switch
              id="devils-advocate"
              checked={board.devilsAdvocate}
              onCheckedChange={toggleDevilsAdvocate}
            />
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-3">
              Suggestions
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_MEMBERS.map((suggestion) => {
                const alreadyAdded = board.members.some(
                  (m) =>
                    m.name.toLowerCase() === suggestion.name.toLowerCase()
                )
                return (
                  <button
                    key={suggestion.name}
                    onClick={() => onAddSuggestion(suggestion.name)}
                    disabled={alreadyAdded || isFull}
                    className={cn(
                      'px-3 py-1.5 rounded-pill border text-[12px] transition-colors',
                      alreadyAdded
                        ? 'border-border text-text-ghost cursor-not-allowed'
                        : 'border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
                    )}
                  >
                    {suggestion.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
