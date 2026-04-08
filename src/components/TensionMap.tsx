import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TensionMap as TensionMapType, Member } from '@/core/types'

interface TensionMapProps {
  tensionMap: TensionMapType
  members: Member[]
}

const CLUSTER_COLORS = [
  '#4ade80',
  '#60a5fa',
  '#f59e0b',
  '#f87171',
  '#a78bfa',
  '#34d399',
]

export function TensionMap({ tensionMap, members }: TensionMapProps) {
  const [expanded, setExpanded] = useState(false)

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]))

  const getMember = (id: string) => memberMap[id]

  if (!tensionMap.clusters.length && !tensionMap.faultLines.length) {
    return null
  }

  return (
    <div className="mt-4 border border-border rounded-card overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-card/50 transition-colors"
      >
        {/* Cluster dots */}
        <div className="flex -space-x-0.5">
          {tensionMap.clusters.map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-sidebar"
              style={{ backgroundColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}
            />
          ))}
        </div>
        <span className="text-[12px] text-text-secondary flex-1 text-left">
          Tension map
        </span>
        <ChevronDown
          size={14}
          className={cn(
            'text-text-muted transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          {/* Clusters */}
          {tensionMap.clusters.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Clusters
              </div>
              <div className="flex flex-col gap-2">
                {tensionMap.clusters.map((cluster, i) => {
                  const color = CLUSTER_COLORS[i % CLUSTER_COLORS.length]
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-2.5 rounded-button bg-card/50"
                    >
                      {/* Member emojis */}
                      <div className="flex -space-x-1.5 shrink-0 mt-0.5">
                        {cluster.memberIds.map((id) => {
                          const member = getMember(id)
                          return (
                            <div
                              key={id}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] border-2"
                              style={{
                                borderColor: color,
                                backgroundColor: `${color}15`,
                              }}
                            >
                              {member?.emoji ?? '?'}
                            </div>
                          )
                        })}
                      </div>
                      {/* Position label */}
                      <div className="text-[12px] text-text-secondary leading-relaxed">
                        {cluster.position}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Fault lines */}
          {tensionMap.faultLines.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Fault lines
              </div>
              <div className="flex flex-col gap-3">
                {tensionMap.faultLines.map((faultLine, i) => (
                  <div key={i}>
                    {/* Fault line name */}
                    <div className="text-[12px] font-medium text-text-primary mb-2">
                      {faultLine.name}
                    </div>

                    {/* Split bar */}
                    <div className="flex items-center gap-1 mb-2">
                      <SplitBar ratio={faultLine.splitRatio} />
                      <span className="text-[10px] text-text-ghost shrink-0 ml-1">
                        {faultLine.splitRatio}
                      </span>
                    </div>

                    {/* Sides */}
                    <div className="flex gap-2">
                      {faultLine.sides.map((side, sideIdx) => (
                        <div key={sideIdx} className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            {side.memberIds.map((id) => {
                              const member = getMember(id)
                              return (
                                <span key={id} className="text-[11px]" title={member?.name}>
                                  {member?.emoji ?? '?'}
                                </span>
                              )
                            })}
                          </div>
                          <div className="text-[11px] text-text-muted leading-relaxed">
                            {side.position}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SplitBar({ ratio }: { ratio: string }) {
  // Parse ratio like "3 vs 2", "3-2", or "4-1"
  const parts = ratio.split(/\s*(?:vs|[-])\s*/i).map(Number)
  const total = parts.reduce((a, b) => a + b, 0) || 1
  const leftPercent = ((parts[0] ?? 1) / total) * 100

  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-border flex">
      <div
        className="h-full rounded-full bg-accent-yes/50"
        style={{ width: `${leftPercent}%` }}
      />
      <div
        className="h-full rounded-full bg-accent-no/50"
        style={{ width: `${100 - leftPercent}%` }}
      />
    </div>
  )
}
