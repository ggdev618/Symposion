import { styled } from '@mui/material/styles'
import { Box, Typography, Button, IconButton, TextField } from '@mui/material'

export const Backdrop = styled(Box)({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: 40,
})

export const ModalContainer = styled(Box)({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
})

export const ModalCard = styled(Box)({
  width: '100%',
  maxWidth: 400,
  backgroundColor: '#161616',
  border: '1px solid #1e1e1e',
  borderRadius: 7,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
})

export const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #1e1e1e',
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
  padding: '20px 20px',
})

export const FieldLabel = styled(Typography)({
  fontSize: 11,
  fontWeight: 500,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 8,
  fontFamily: 'Inter, sans-serif',
})

export const ApiKeyField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#181818',
    borderRadius: 5,
    fontSize: 13,
    color: '#e0e0e0',
    fontFamily: 'monospace',
    '& fieldset': { borderColor: '#1e1e1e' },
    '&:hover fieldset': { borderColor: '#2a2a2a' },
    '&.Mui-focused fieldset': { borderColor: '#2a2a2a' },
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#3a3a3a',
    opacity: 1,
  },
})

export const ToggleVisibilityButton = styled(IconButton)({
  color: '#666',
  '& .MuiSvgIcon-root': { fontSize: 14 },
  '&:hover': {
    color: '#bbb',
  },
})

export const Footer = styled(Box)({
  padding: '16px 20px',
  borderTop: '1px solid #1e1e1e',
})

export const SaveButton = styled(Button)({
  width: '100%',
  padding: '10px 0',
  backgroundColor: '#ffffff',
  color: '#000000',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  borderRadius: 5,
  textTransform: 'none',
  transition: 'all 150ms ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
})
