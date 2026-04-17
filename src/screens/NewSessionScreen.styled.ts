import { styled } from '@mui/material/styles'
import { Box, Typography, Button, TextField } from '@mui/material'

export const Root = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '48px 32px',
})

export const HeaderArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: 576,
})

export const AvatarStack = styled(Box)({
  display: 'flex',
  marginBottom: 24,
  '& > *:not(:first-of-type)': {
    marginLeft: -8,
  },
})

export const AvatarCircle = styled(Box)({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: '#1e1e1e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  border: '2px solid #111',
})

export const Heading = styled(Typography)({
  fontSize: 20,
  fontWeight: 500,
  color: '#e0e0e0',
  textAlign: 'center',
  lineHeight: 1.3,
  marginBottom: 32,
})

export const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  width: '100%',
  maxWidth: 448,
})

export const SessionCard = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
  padding: 16,
  borderRadius: 7,
  border: `1px solid ${selected ? '#2a2a2a' : '#1e1e1e'}`,
  backgroundColor: selected ? '#181818' : 'rgba(24, 24, 24, 0.5)',
  textAlign: 'left',
  textTransform: 'none',
  display: 'block',
  transition: 'all 150ms ease',
  '&:hover': {
    borderColor: '#2a2a2a',
    backgroundColor: selected ? '#181818' : 'rgba(24, 24, 24, 0.5)',
  },
}))

export const CardEmoji = styled(Typography)({
  fontSize: 20,
  marginBottom: 8,
})

export const CardTitle = styled(Typography)({
  fontSize: 13,
  fontWeight: 500,
  color: '#e0e0e0',
  marginBottom: 4,
})

export const CardDescription = styled(Typography)({
  fontSize: 11,
  color: '#666',
  lineHeight: 1.6,
})

export const CardWarning = styled(Typography)({
  fontSize: 10,
  color: '#f87171',
  lineHeight: 1.6,
  marginTop: 8,
})

export const EmptyBoardWarning = styled(Typography)({
  fontSize: 12,
  color: '#f87171',
  marginTop: 16,
})

export const InputBarWrapper = styled(Box)({
  width: '100%',
  maxWidth: 672,
  marginTop: 32,
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

export const InputBarFooter = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginTop: 8,
  gap: 16,
})

export const HintText = styled(Typography)({
  fontSize: 11,
  color: '#3a3a3a',
})

export const ListenButton = styled(Button)({
  fontSize: 11,
  color: '#3a3a3a',
  textTransform: 'none',
  padding: 0,
  minWidth: 0,
  lineHeight: 1.5,
  flexShrink: 0,
  fontFamily: 'Inter, sans-serif',
  transition: 'color 150ms',
  '&:hover': {
    color: '#666',
    backgroundColor: 'transparent',
  },
  '&.Mui-disabled': {
    color: '#2a2a2a',
  },
})

export const ListenWarning = styled(Typography)({
  fontSize: 10,
  color: '#f87171',
  textAlign: 'right',
  marginTop: 2,
})
