import { styled } from '@mui/material/styles'
import { Box, Typography, Button, IconButton, TextField } from '@mui/material'

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
  gap: 12,
  padding: '20px 24px',
  borderBottom: '1px solid #1e1e1e',
  flexShrink: 0,
})

export const BackButton = styled(IconButton)({
  color: '#666',
  '& .MuiSvgIcon-root': { fontSize: 16 },
  '&:hover': {
    color: '#bbb',
  },
})

export const HeaderTitle = styled(Typography)({
  fontSize: 15,
  fontWeight: 600,
  color: '#e0e0e0',
  fontFamily: 'Inter, sans-serif',
})

export const Content = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px',
})

export const SectionLabel = styled(Typography)({
  fontSize: 11,
  fontWeight: 500,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 8,
  fontFamily: 'Inter, sans-serif',
})

export const AutoFillSection = styled(Box)({
  marginBottom: 20,
})

export const AutoFillRow = styled(Box)({
  display: 'flex',
  gap: 8,
})

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#181818',
    borderRadius: 5,
    fontSize: 13,
    color: '#e0e0e0',
    fontFamily: 'Inter, sans-serif',
    '& fieldset': { borderColor: '#1e1e1e' },
    '&:hover fieldset': { borderColor: '#2a2a2a' },
    '&.Mui-focused fieldset': { borderColor: '#2a2a2a' },
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#3a3a3a',
    opacity: 1,
  },
})

export const FillButton = styled(Button)({
  padding: '8px 12px',
  backgroundColor: '#fff',
  color: '#000',
  fontSize: 12,
  fontWeight: 500,
  borderRadius: 5,
  textTransform: 'none',
  minWidth: 0,
  flexShrink: 0,
  '& .MuiButton-startIcon .MuiSvgIcon-root': { fontSize: 12 },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'rgba(0, 0, 0, 0.3)',
  },
})

export const DividerWrapper = styled(Box)({
  position: 'relative',
  marginTop: 24,
  marginBottom: 24,
})

export const DividerLine = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
})

export const DividerBorder = styled(Box)({
  width: '100%',
  borderTop: '1px solid #1e1e1e',
})

export const DividerLabelWrap = styled(Box)({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
})

export const DividerLabel = styled(Typography)({
  fontSize: 11,
  backgroundColor: '#161616',
  paddingLeft: 12,
  paddingRight: 12,
  color: '#3a3a3a',
  fontFamily: 'Inter, sans-serif',
})

export const FormFields = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
})

export const FieldLabelRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 6,
})

export const FieldLabel = styled(Typography)({
  fontSize: 11,
  fontWeight: 500,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontFamily: 'Inter, sans-serif',
})

export const EmojiRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
})

export const EmojiPreview = styled(Box)({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: '#1e1e1e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  flexShrink: 0,
})

export const Footer = styled(Box)({
  padding: '16px 24px',
  borderTop: '1px solid #1e1e1e',
  flexShrink: 0,
})

export const SubmitButton = styled(Button)({
  width: '100%',
  padding: '10px 0',
  backgroundColor: '#fff',
  color: '#000',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 5,
  textTransform: 'none',
  transition: 'all 150ms',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '&.Mui-disabled': {
    opacity: 0.3,
    backgroundColor: '#fff',
    color: '#000',
  },
})

export const SaveToBankButton = styled(Button)({
  width: '100%',
  padding: '10px 0',
  backgroundColor: 'transparent',
  color: '#e0e0e0',
  border: '1px solid #2a2a2a',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 5,
  textTransform: 'none',
  transition: 'all 150ms',
  '&:hover': {
    backgroundColor: '#1e1e1e',
    borderColor: '#3a3a3a',
  },
  '&.Mui-disabled': {
    opacity: 0.25,
    color: '#e0e0e0',
  },
})

export const FooterButtons = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

export const MissingFieldsHint = styled(Typography)({
  marginTop: 8,
  fontSize: 11,
  color: '#444',
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
})

export const AiFilledChip = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 10,
  fontWeight: 500,
  color: '#4ade80',
  backgroundColor: 'rgba(74, 222, 128, 0.08)',
  border: '1px solid rgba(74, 222, 128, 0.12)',
  padding: '2px 6px',
  borderRadius: 99,
  fontFamily: 'Inter, sans-serif',
  '& .MuiSvgIcon-root': { fontSize: 9 },
}) as typeof Box
