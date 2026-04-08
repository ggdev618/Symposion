import { cn } from '@/lib/utils'

interface LoadingDialogueProps {
  memberCount: number
}

export function LoadingDialogue({ memberCount }: LoadingDialogueProps) {
  const rows = Array.from({ length: memberCount }, (_, i) => i)

  return (
    <div className="border border-border rounded-card overflow-hidden">
      {rows.map((i) => (
        <div key={i}>
          {i > 0 && <div className="border-t border-[#1a1a1a]" />}
          <div className="px-4 py-3 flex items-start gap-3">
            {/* Avatar circle */}
            <div
              className={cn(
                'w-6 h-6 rounded-full bg-border shrink-0 animate-pulse'
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
            {/* Text lines */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div
                className="h-3 bg-border rounded-full animate-pulse mb-2"
                style={{
                  width: `${30 + (i % 3) * 10}%`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
              <div
                className="h-3 bg-border rounded-full animate-pulse"
                style={{
                  width: `${60 + (i % 2) * 20}%`,
                  animationDelay: `${i * 150 + 75}ms`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
