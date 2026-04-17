import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const Root = styled(Box)({
  marginTop: 16,
  border: '1px solid #1e1e1e',
  borderRadius: 7,
  overflow: 'hidden',
})

export const HeaderButton = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'background-color 150ms ease',
  border: 'none',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(24, 24, 24, 0.5)',
  },
}) as typeof Box

export const ClusterDotsRow = styled(Box)({
  display: 'flex',
  '& > *:not(:first-of-type)': {
    marginLeft: -2,
  },
})

export const ClusterDot = styled(Box)({
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: '1px solid #161616',
})

export const HeaderLabel = styled(Typography)({
  fontSize: 12,
  color: '#bbb',
  flex: 1,
  textAlign: 'left',
  fontFamily: 'Inter, sans-serif',
})

export const ExpandIcon = styled(ExpandMoreIcon, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  fontSize: 14,
  color: '#666',
  transition: 'transform 200ms ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
}))

export const CollapseContent = styled(Box)({
  padding: '0 16px 16px',
  borderTop: '1px solid #1e1e1e',
})

export const SectionTitle = styled(Typography)({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#666',
  marginBottom: 8,
  fontFamily: 'Inter, sans-serif',
})

export const ClustersSection = styled(Box)({
  marginTop: 12,
})

export const ClusterList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

export const ClusterCard = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(24, 24, 24, 0.5)',
})

export const MemberEmojiRow = styled(Box)({
  display: 'flex',
  flexShrink: 0,
  marginTop: 2,
  '& > *:not(:first-of-type)': {
    marginLeft: -6,
  },
})

export const MemberEmojiBubble = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  borderWidth: 2,
  borderStyle: 'solid',
})

export const ClusterPosition = styled(Typography)({
  fontSize: 12,
  color: '#bbb',
  lineHeight: 1.6,
  fontFamily: 'Inter, sans-serif',
})

export const FaultLinesSection = styled(Box)({
  marginTop: 16,
})

export const FaultLineList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
})

export const FaultLineName = styled(Typography)({
  fontSize: 12,
  fontWeight: 500,
  color: '#e0e0e0',
  marginBottom: 8,
  fontFamily: 'Inter, sans-serif',
})

export const SplitBarRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginBottom: 8,
})

export const SplitBarTrack = styled(Box)({
  flex: 1,
  height: 6,
  borderRadius: 99,
  overflow: 'hidden',
  backgroundColor: '#1e1e1e',
  display: 'flex',
})

export const SplitBarLeft = styled(Box)({
  height: '100%',
  borderRadius: 99,
  backgroundColor: 'rgba(74, 222, 128, 0.5)',
})

export const SplitBarRight = styled(Box)({
  height: '100%',
  borderRadius: 99,
  backgroundColor: 'rgba(248, 113, 113, 0.5)',
})

export const SplitRatioLabel = styled(Typography)({
  fontSize: 10,
  color: '#3a3a3a',
  flexShrink: 0,
  marginLeft: 4,
  fontFamily: 'Inter, sans-serif',
}) as typeof Typography

export const SidesRow = styled(Box)({
  display: 'flex',
  gap: 8,
})

export const SideColumn = styled(Box)({
  flex: 1,
  minWidth: 0,
})

export const SideMembersRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginBottom: 4,
})

export const SideMemberEmoji = styled(Typography)({
  fontSize: 11,
  fontFamily: 'Inter, sans-serif',
}) as typeof Typography

export const SidePosition = styled(Typography)({
  fontSize: 11,
  color: '#666',
  lineHeight: 1.6,
  fontFamily: 'Inter, sans-serif',
})
