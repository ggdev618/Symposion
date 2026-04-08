import { useState } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Member } from '@/core/types'
import { generateMemberId } from '@/core/board'

interface AddMemberPanelProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (member: Member) => void
  onAutoFill: (description: string) => Promise<{
    name: string
    emoji: string
    role: string
    personality: string
  }>
}

export function AddMemberPanel({
  isOpen,
  onClose,
  onAddMember,
  onAutoFill,
}: AddMemberPanelProps) {
  const [autoFillInput, setAutoFillInput] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [emoji, setEmoji] = useState('')
  const [personality, setPersonality] = useState('')
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set())
  const [isAutoFilling, setIsAutoFilling] = useState(false)

  const resetForm = () => {
    setAutoFillInput('')
    setName('')
    setRole('')
    setEmoji('')
    setPersonality('')
    setFilledFields(new Set())
    setIsAutoFilling(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleAutoFill = async () => {
    if (!autoFillInput.trim() || isAutoFilling) return
    setIsAutoFilling(true)
    try {
      const result = await onAutoFill(autoFillInput.trim())
      setName(result.name)
      setEmoji(result.emoji)
      setRole(result.role)
      setPersonality(result.personality)
      setFilledFields(new Set(['name', 'emoji', 'role', 'personality']))
    } finally {
      setIsAutoFilling(false)
    }
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const member: Member = {
      id: generateMemberId(name),
      name: name.trim(),
      emoji: emoji.trim() || '?',
      role: role.trim(),
      personality: personality.trim(),
      memories: [],
    }
    onAddMember(member)
    resetForm()
  }

  const canSubmit = name.trim().length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-sidebar border-l border-border z-50 flex flex-col transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border shrink-0">
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-button text-text-muted hover:text-text-secondary hover:bg-border transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-[15px] font-semibold text-text-primary">
            Add member
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Auto-fill section */}
          <div className="mb-5">
            <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider block mb-2">
              Describe any real or fictional character
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={autoFillInput}
                onChange={(e) => setAutoFillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAutoFill()
                }}
                placeholder="e.g. Elon Musk, Gandalf, Marie Curie..."
                className="flex-1 bg-card border border-border rounded-button px-3 py-2 text-[13px] text-text-primary placeholder:text-text-ghost outline-none focus:border-border-hover transition-colors"
              />
              <button
                onClick={handleAutoFill}
                disabled={!autoFillInput.trim() || isAutoFilling}
                className="px-3 py-2 bg-white text-black text-[12px] font-medium rounded-button hover:bg-white/90 disabled:opacity-30 transition-all shrink-0 flex items-center gap-1.5"
              >
                Fill
                <Sparkles size={12} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-sidebar px-3 text-text-ghost">
                or fill manually
              </span>
            </div>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  Name
                </label>
                {filledFields.has('name') && <AiFilledTag />}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setFilledFields((s) => {
                    const next = new Set(s)
                    next.delete('name')
                    return next
                  })
                }}
                placeholder="Character name"
                className="w-full bg-card border border-border rounded-button px-3 py-2 text-[13px] text-text-primary placeholder:text-text-ghost outline-none focus:border-border-hover transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  Role
                </label>
                {filledFields.has('role') && <AiFilledTag />}
              </div>
              <input
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setFilledFields((s) => {
                    const next = new Set(s)
                    next.delete('role')
                    return next
                  })
                }}
                placeholder="e.g. Strategist, Devil's advocate"
                className="w-full bg-card border border-border rounded-button px-3 py-2 text-[13px] text-text-primary placeholder:text-text-ghost outline-none focus:border-border-hover transition-colors"
              />
            </div>

            {/* Emoji */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  Emoji
                </label>
                {filledFields.has('emoji') && <AiFilledTag />}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => {
                    setEmoji(e.target.value)
                    setFilledFields((s) => {
                      const next = new Set(s)
                      next.delete('emoji')
                      return next
                    })
                  }}
                  placeholder="Pick an emoji"
                  className="flex-1 bg-card border border-border rounded-button px-3 py-2 text-[13px] text-text-primary placeholder:text-text-ghost outline-none focus:border-border-hover transition-colors"
                />
                <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-[18px] shrink-0">
                  {emoji || '?'}
                </div>
              </div>
            </div>

            {/* Personality */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  Personality
                </label>
                {filledFields.has('personality') && <AiFilledTag />}
              </div>
              <textarea
                value={personality}
                onChange={(e) => {
                  setPersonality(e.target.value)
                  setFilledFields((s) => {
                    const next = new Set(s)
                    next.delete('personality')
                    return next
                  })
                }}
                placeholder="How they think, argue, and what they value..."
                rows={4}
                className="w-full bg-card border border-border rounded-button px-3 py-2 text-[13px] text-text-primary placeholder:text-text-ghost outline-none focus:border-border-hover transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-2.5 bg-white text-black text-[13px] font-medium rounded-button hover:bg-white/90 disabled:opacity-30 transition-all"
          >
            Add to board
          </button>
        </div>
      </div>
    </>
  )
}

function AiFilledTag() {
  return (
    <span className="text-[10px] font-medium text-accent-yes bg-accent-yes/[0.08] border border-accent-yes/[0.12] px-1.5 py-0.5 rounded-pill flex items-center gap-1">
      <Sparkles size={9} />
      AI filled
    </span>
  )
}
