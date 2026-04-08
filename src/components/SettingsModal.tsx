import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string | null
  onSaveApiKey: (key: string) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}: SettingsModalProps) {
  const [key, setKey] = useState(apiKey ?? '')
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    onSaveApiKey(key.trim())
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'w-full max-w-[400px] bg-sidebar border border-border rounded-card shadow-2xl',
            'animate-in fade-in zoom-in-95 duration-150'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-text-primary">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-button text-text-muted hover:text-text-secondary hover:bg-border transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider block mb-2">
              API key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-card border border-border rounded-button px-3 py-2 pr-10 text-[13px] text-text-primary placeholder:text-text-ghost outline-none focus:border-border-hover transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border">
            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-white text-black text-[13px] font-medium rounded-button hover:bg-white/90 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
