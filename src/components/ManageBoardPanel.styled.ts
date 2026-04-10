import { styled } from '@mui/material/styles'
import { Box, Typography, Button, IconButton, Switch } from '@mui/material'

export const Backdrop = styled(Box)<{ open: boolean }>(({ open }) => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: 40,
  transition: 'opacity 200ms',
  opacity: open ? 1 : 0,
  pointerEvents: open ? 'auto' : 'none',
}))

export const Panel = styled(Box)<{ open: boolean }>(({ open }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100%',
  width: 420,
  maxWidth: '90vw',
  backgroundColor: '#161616',
  borderLeft: '1px solid #1e1e1e',
  zIndex: 50,
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 200ms ease-out',
  transform: open ? 'translateX(0)' : 'translateX(100%)',
}))

export const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: '1px solid #1e1e1e',
  flexShrink: 0,
})

export const HeaderTitle = styled(Typography)({
  fontSize: 15,
  fontWeight: 600,
  color: '#e0e0e0',
  fontFamily: 'Inter, sans-serif',
})

export const CloseButton = styled(IconButton)({
  color: '#666',
  '& .MuiSvgIcon-root': { fontSize: 16 },
  '&:hover': {
    color: '#bbb',
  },
})

export const Content = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px',
})

export const MemberGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
})

export const MemberCard = styled(Box)({
  position: 'relative',
  padding: 12,
  backgroundColor: '#181818',
  border: '1px solid #1e1e1e',
  borderRadius: 7,
  '&:hover .remove-btn': {
    opacity: 1,
  },
})

export const RemoveButton = styled(IconButton)({
  position: 'absolute',
  top: 8,
  right: 8,
  width: 20,
  height: 20,
  color: '#3a3a3a',
  opacity: 0,
  transition: 'opacity 150ms',
  '& .MuiSvgIcon-root': { fontSize: 12 },
  '&:hover': {
    color: '#bbb',
  },
})

export const EmojiCircle = styled(Box)({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: '#1e1e1e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  marginBottom: 8,
})

export const MemberName = styled(Typography)({
  fontSize: 13,
  fontWeight: 500,
  color: '#e0e0e0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: 'Inter, sans-serif',
})

export const MemberRole = styled(Typography)({
  fontSize: 11,
  color: '#666',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: 'Inter, sans-serif',
})

export const MemberPersonality = styled(Typography)({
  fontSize: 11,
  color: '#3a3a3a',
  lineHeight: 1.625,
  marginTop: 6,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  fontFamily: 'Inter, sans-serif',
})

export const AddMemberButton = styled(Button)({
  padding: 12,
  border: '1px dashed #666',
  borderRadius: 7,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minHeight: 120,
  textTransform: 'none',
  transition: 'border-color 150ms, color 150ms',
  '&:hover': {
    borderColor: '#bbb',
    backgroundColor: 'transparent',
  },
  '&:hover .add-icon': {
    borderColor: '#bbb',
    color: '#bbb',
  },
  '&:hover .add-label': {
    color: '#bbb',
  },
})

export const AddIconCircle = styled(Box)({
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: '1px dashed #666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  color: '#666',
  transition: 'border-color 150ms, color 150ms',
})

export const AddLabel = styled(Typography)({
  fontSize: 12,
  color: '#666',
  transition: 'color 150ms',
  fontFamily: 'Inter, sans-serif',
})

export const BoardFullNote = styled(Typography)({
  fontSize: 11,
  color: '#666',
  marginTop: 12,
  fontFamily: 'Inter, sans-serif',
})

export const DevilsAdvocateRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 24,
  paddingTop: 12,
  paddingBottom: 12,
  borderTop: '1px solid #1e1e1e',
})

export const DevilsAdvocateLabel = styled(Typography)({
  fontSize: 13,
  color: '#bbb',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
})

export const StyledSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#4ade80',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#4ade80',
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#1e1e1e',
  },
})

export const SuggestionsSection = styled(Box)({
  marginTop: 24,
})

export const SuggestionsTitle = styled(Typography)({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#666',
  marginBottom: 12,
  fontFamily: 'Inter, sans-serif',
})

export const SuggestionsWrap = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
})

export const SuggestionChip = styled(Button)<{ disabled?: boolean }>(({ disabled }) => ({
  padding: '6px 12px',
  borderRadius: 99,
  border: '1px solid #1e1e1e',
  fontSize: 12,
  textTransform: 'none',
  minWidth: 0,
  transition: 'border-color 150ms, color 150ms',
  color: disabled ? '#3a3a3a' : '#bbb',
  ...(disabled
    ? {}
    : {
        '&:hover': {
          borderColor: '#2a2a2a',
          color: '#e0e0e0',
          backgroundColor: 'transparent',
        },
      }),
}))
