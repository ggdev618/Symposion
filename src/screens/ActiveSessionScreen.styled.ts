import { styled } from '@mui/material/styles'
import { Box, Typography, Button, IconButton, TextField, Chip } from '@mui/material'

// ─── Layout ────────────────────────────────────────────

export const Root = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
})

export const TopBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 24px',
  borderBottom: '1px solid #1e1e1e',
  flexShrink: 0,
})

export const TopBarTitle = styled(Typography)({
  fontSize: 13,
  color: '#666',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '50%',
})

export const TopBarActions = styled(Box)({
  display: 'flex',
  gap: 8,
})

export const TopBarButton = styled(Button)({
  padding: '6px 12px',
  fontSize: 12,
  color: '#bbb',
  border: '1px solid #1e1e1e',
  borderRadius: 5,
  textTransform: 'none',
  minWidth: 0,
  transition: 'border-color 150ms ease',
  '& .MuiButton-startIcon .MuiSvgIcon-root': { fontSize: 12 },
  '&:hover': {
    borderColor: '#2a2a2a',
    backgroundColor: 'transparent',
  },
})

// ─── Member Chips ──────────────────────────────────────

export const ChipBar = styled(Box)({
  display: 'flex',
  gap: 8,
  padding: '12px 24px',
  borderBottom: '1px solid #1e1e1e',
  flexShrink: 0,
  overflowX: 'auto',
})

export const MemberChip = styled(Chip)({
  borderColor: '#1e1e1e',
  color: '#bbb',
  fontSize: 12,
  borderRadius: 99,
  '& .MuiChip-icon': {
    marginLeft: 4,
  },
})

export const ChipEmojiIcon = styled(Box)({
  fontSize: 11,
  marginLeft: 4,
})

// ─── Session Body ──────────────────────────────────────

export const SessionBody = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '24px 24px',
})

export const ListenModeHeader = styled(Box)({
  marginBottom: 16,
})

export const ListenModeLabel = styled(Typography)({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#3a3a3a',
  marginBottom: 4,
})

// ─── Loading ───────────────────────────────────────────

export const LoadingWrapper = styled(Box)({
  marginBottom: 24,
})

export const ListeningIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
})

export const ListeningDot = styled(Box)({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#4ade80',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
})

export const ListeningText = styled(Typography)({
  fontSize: 12,
  color: '#666',
})

// ─── Error ─────────────────────────────────────────────

export const ErrorBox = styled(Box)({
  marginBottom: 24,
  padding: 12,
  borderRadius: 7,
  border: '1px solid rgba(248, 113, 113, 0.2)',
  backgroundColor: 'rgba(248, 113, 113, 0.05)',
})

export const ErrorInner = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
})

export const ErrorText = styled(Typography)({
  fontSize: 13,
  color: '#f87171',
})

export const ErrorCloseButton = styled(IconButton)({
  color: 'rgba(248, 113, 113, 0.6)',
  '& .MuiSvgIcon-root': { fontSize: 14 },
  '&:hover': {
    color: '#f87171',
  },
})

// ─── Input Bar ─────────────────────────────────────────

export const InputBarSection = styled(Box)({
  padding: '16px 24px',
  borderTop: '1px solid #1e1e1e',
  flexShrink: 0,
})

export const InputBarContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end',
  backgroundColor: '#1a1a1a',
  border: '1px solid #1e1e1e',
  borderRadius: 7,
})

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#e0e0e0',
    '& fieldset': { border: 'none' },
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#3a3a3a',
    opacity: 1,
  },
})

export const SubmitButton = styled(Button)({
  margin: 8,
  width: 36,
  height: 36,
  minWidth: 0,
  padding: 0,
  backgroundColor: '#fff',
  color: '#000',
  borderRadius: 5,
  flexShrink: 0,
  transition: 'all 150ms ease',
  '& .MuiSvgIcon-root': { fontSize: 16 },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '&.Mui-disabled': {
    opacity: 0.3,
    backgroundColor: '#fff',
    color: '#000',
  },
})

// ─── Message Block ─────────────────────────────────────

export const MessageWrapper = styled(Box)({
  marginBottom: 24,
})

export const UserQuestionLabel = styled(Typography)({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#666',
  marginBottom: 8,
})

export const UserQuestionText = styled(Typography)({
  fontSize: 15,
  color: '#e0e0e0',
  lineHeight: 1.6,
})

export const DialogueContainer = styled(Box)({
  border: '1px solid #1e1e1e',
  borderRadius: 7,
  overflow: 'hidden',
})

export const DialogueDivider = styled(Box)({
  borderTop: '1px solid #1a1a1a',
})

export const DialogueLineWrapper = styled(Box)({
  padding: '12px 16px',
})

export const GuestSummonedLabel = styled(Typography)({
  fontSize: 10,
  color: '#3a3a3a',
  fontStyle: 'italic',
  marginBottom: 6,
})

export const DialogueLineHeader = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
})

export const SpeakerInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
})

export const SpeakerEmoji = styled(Typography)({
  fontSize: 13,
})

export const SpeakerName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isFirst' && prop !== 'isDevil',
})<{ isFirst?: boolean; isDevil?: boolean }>(({ isFirst, isDevil }) => ({
  fontSize: 13,
  fontWeight: isFirst ? 600 : 400,
  fontStyle: isDevil ? 'italic' : 'normal',
  color: isDevil ? '#666' : '#e0e0e0',
}))

export const VotePill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'vote',
})<{ vote: 'yes' | 'no' | string }>(({ vote }) => {
  const isYes = vote === 'yes'
  const isNo = vote === 'no'
  const accent = isYes ? '#4ade80' : isNo ? '#f87171' : undefined

  return {
    fontSize: 10,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: 99,
    ...(accent
      ? {
          backgroundColor: `${accent}14`,
          color: accent,
          border: `1px solid ${accent}1f`,
        }
      : {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          color: '#666',
          border: '1px solid #1e1e1e',
        }),
  }
})

export const DismissGuestButton = styled(IconButton)({
  color: '#3a3a3a',
  '& .MuiSvgIcon-root': { fontSize: 12 },
  '&:hover': {
    color: '#666',
  },
})

export const DialogueText = styled(Typography)({
  fontSize: 13,
  color: '#bbb',
  lineHeight: 1.6,
  marginTop: 6,
  marginLeft: 29,
})

// ─── Verdict ───────────────────────────────────────────

export const VerdictBox = styled(Box)({
  marginTop: 16,
  paddingLeft: 16,
  borderLeft: '2px solid #2a2a2a',
})

export const VerdictLabel = styled(Typography)({
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#666',
  marginBottom: 4,
})

export const VerdictText = styled(Typography)({
  fontSize: 13,
  color: '#bbb',
  lineHeight: 1.6,
})
