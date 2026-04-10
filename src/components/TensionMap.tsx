import { useState } from 'react'
import { Collapse } from '@mui/material'
import type { TensionMap as TensionMapType, Member } from '@/core/types'
import {
  Root,
  HeaderButton,
  ClusterDotsRow,
  ClusterDot,
  HeaderLabel,
  ExpandIcon,
  CollapseContent,
  ClustersSection,
  SectionTitle,
  ClusterList,
  ClusterCard,
  MemberEmojiRow,
  MemberEmojiBubble,
  ClusterPosition,
  FaultLinesSection,
  FaultLineList,
  FaultLineName,
  SplitBarRow,
  SplitBarTrack,
  SplitBarLeft,
  SplitBarRight,
  SplitRatioLabel,
  SidesRow,
  SideColumn,
  SideMembersRow,
  SideMemberEmoji,
  SidePosition,
} from './TensionMap.styled'

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
    <Root>
      {/* Collapsed header */}
      <HeaderButton
        component="button"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Cluster dots */}
        <ClusterDotsRow>
          {tensionMap.clusters.map((_, i) => (
            <ClusterDot
              key={i}
              style={{ backgroundColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}
            />
          ))}
        </ClusterDotsRow>
        <HeaderLabel>Tension map</HeaderLabel>
        <ExpandIcon expanded={expanded} />
      </HeaderButton>

      {/* Expanded content */}
      <Collapse in={expanded}>
        <CollapseContent>
          {/* Clusters */}
          {tensionMap.clusters.length > 0 && (
            <ClustersSection>
              <SectionTitle>Clusters</SectionTitle>
              <ClusterList>
                {tensionMap.clusters.map((cluster, i) => {
                  const color = CLUSTER_COLORS[i % CLUSTER_COLORS.length]
                  return (
                    <ClusterCard key={i}>
                      {/* Member emojis */}
                      <MemberEmojiRow>
                        {cluster.memberIds.map((id) => {
                          const member = getMember(id)
                          return (
                            <MemberEmojiBubble
                              key={id}
                              style={{
                                borderColor: color,
                                backgroundColor: `${color}15`,
                              }}
                            >
                              {member?.emoji ?? '?'}
                            </MemberEmojiBubble>
                          )
                        })}
                      </MemberEmojiRow>
                      <ClusterPosition>{cluster.position}</ClusterPosition>
                    </ClusterCard>
                  )
                })}
              </ClusterList>
            </ClustersSection>
          )}

          {/* Fault lines */}
          {tensionMap.faultLines.length > 0 && (
            <FaultLinesSection>
              <SectionTitle>Fault lines</SectionTitle>
              <FaultLineList>
                {tensionMap.faultLines.map((faultLine, i) => {
                  const parts = faultLine.splitRatio
                    .split(/\s*(?:vs|[-])\s*/i)
                    .map(Number)
                  const total = parts.reduce((a, b) => a + b, 0) || 1
                  const leftPercent = ((parts[0] ?? 1) / total) * 100

                  return (
                    <div key={i}>
                      <FaultLineName>{faultLine.name}</FaultLineName>

                      {/* Split bar */}
                      <SplitBarRow>
                        <SplitBarTrack>
                          <SplitBarLeft style={{ width: `${leftPercent}%` }} />
                          <SplitBarRight style={{ width: `${100 - leftPercent}%` }} />
                        </SplitBarTrack>
                        <SplitRatioLabel component="span">
                          {faultLine.splitRatio}
                        </SplitRatioLabel>
                      </SplitBarRow>

                      {/* Sides */}
                      <SidesRow>
                        {faultLine.sides.map((side, sideIdx) => (
                          <SideColumn key={sideIdx}>
                            <SideMembersRow>
                              {side.memberIds.map((id) => {
                                const member = getMember(id)
                                return (
                                  <SideMemberEmoji
                                    key={id}
                                    component="span"
                                    title={member?.name}
                                  >
                                    {member?.emoji ?? '?'}
                                  </SideMemberEmoji>
                                )
                              })}
                            </SideMembersRow>
                            <SidePosition>{side.position}</SidePosition>
                          </SideColumn>
                        ))}
                      </SidesRow>
                    </div>
                  )
                })}
              </FaultLineList>
            </FaultLinesSection>
          )}
        </CollapseContent>
      </Collapse>
    </Root>
  )
}
