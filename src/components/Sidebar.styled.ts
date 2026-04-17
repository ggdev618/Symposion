import { styled } from '@mui/material/styles'
import { Box, Typography, Button, IconButton } from '@mui/material'

/* ── Design tokens ── */
const tokens = {
  bg: '#111',
  sidebar: '#161616',
  card: '#181818',
  border: '#1e1e1e',
  borderHover: '#2a2a2a',
  textPrimary: '#e0e0e0',
  textSecondary: '#bbb',
  textMuted: '#666',
  textGhost: '#3a3a3a',
  accentYes: '#4ade80',
  accentNo: '#f87171',
  font: 'Inter, sans-serif',
  radiusCard: '7px',
  radiusButton: '5px',
  radiusPill: '99px',
} as const

/* ── Root sidebar container ── */
export const SidebarRoot = styled(Box)({
  width: 220,
  minWidth: 220,
  height: '100%',
  backgroundColor: tokens.sidebar,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${tokens.border}`,
  fontFamily: tokens.font,
}) as typeof Box

/* ── Logo section ── */
export const LogoWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '20px 20px',
  justifyContent: 'space-between',
})

export const LogoLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

export const SettingsButton = styled(IconButton)({
  color: tokens.textMuted,
  width: 28,
  height: 28,
  flexShrink: 0,
  '& .MuiSvgIcon-root': { fontSize: 15 },
  '&:hover': {
    color: tokens.textSecondary,
  },
})

export const LogoIcon = styled(Box)({
  width: 28,
  height: 28,
  backgroundColor: '#fff',
  borderRadius: tokens.radiusButton,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
})

export const LogoText = styled(Typography)({
  fontSize: 14,
  fontWeight: 600,
  color: tokens.textPrimary,
  letterSpacing: '-0.02em',
})

/* ── Members section ── */
export const MembersSection = styled(Box)({
  padding: '0 16px',
  marginTop: 4,
})

export const SectionLabel = styled(Typography)({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: tokens.textMuted,
  marginBottom: 8,
})

export const MemberList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
})

export const MemberRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '6px 4px',
})

export const MemberAvatar = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: tokens.border,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  flexShrink: 0,
})

export const MemberInfo = styled(Box)({
  minWidth: 0,
})

export const MemberName = styled(Typography)({
  fontSize: 12,
  color: tokens.textSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const MemberRole = styled(Typography)({
  fontSize: 10,
  color: tokens.textGhost,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/* ── Manage board button ── */
export const ManageBoardButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '6px 4px',
  marginTop: 4,
  width: '100%',
  textAlign: 'left',
  textTransform: 'none',
  justifyContent: 'flex-start',
  '&:hover .manage-icon': {
    borderColor: tokens.textSecondary,
  },
  '&:hover .manage-label': {
    color: tokens.textSecondary,
  },
})

export const ManageBoardIcon = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: `1px dashed ${tokens.textMuted}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  color: tokens.textMuted,
  transition: 'border-color 0.15s',
})

export const ManageBoardLabel = styled(Typography)({
  fontSize: 12,
  color: tokens.textMuted,
  transition: 'color 0.15s',
})

/* ── Divider ── */
export const SidebarDivider = styled(Box)({
  margin: '12px 16px',
  borderTop: `1px solid ${tokens.border}`,
})

/* ── Sessions section ── */
export const SessionsSection = styled(Box)({
  padding: '0 16px',
  flex: 1,
  overflowY: 'auto',
})

export const SessionList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
})

export const SessionRow = styled(Box)({
  position: 'relative',
  '&:hover .session-delete': {
    opacity: 1,
  },
})

export const SessionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  textAlign: 'left',
  padding: '6px 8px',
  paddingRight: 28,
  borderRadius: tokens.radiusButton,
  textTransform: 'none',
  display: 'block',
  width: '100%',
  transition: 'background-color 0.15s',
  backgroundColor: active ? tokens.border : 'transparent',
  color: active ? tokens.textPrimary : tokens.textSecondary,
  '&:hover': {
    backgroundColor: active ? tokens.border : 'rgba(30,30,30,0.5)',
  },
}))

export const SessionDeleteButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  right: 4,
  transform: 'translateY(-50%)',
  width: 20,
  height: 20,
  color: tokens.textGhost,
  opacity: 0,
  transition: 'opacity 150ms, color 150ms',
  '& .MuiSvgIcon-root': { fontSize: 12 },
  '&:hover': {
    color: tokens.textSecondary,
  },
})

export const SessionTitle = styled(Typography)({
  fontSize: 12,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const SessionDate = styled(Typography)({
  fontSize: 10,
  color: tokens.textGhost,
})

/* ── New session button ── */
export const NewSessionWrapper = styled(Box)({
  padding: 16,
})

export const NewSessionButton = styled(Button)({
  width: '100%',
  padding: '10px 0',
  backgroundColor: '#fff',
  color: '#000',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: tokens.radiusButton,
  textTransform: 'none',
  transition: 'background-color 0.15s',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
})
