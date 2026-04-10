import { styled, keyframes } from '@mui/material/styles'
import { Box } from '@mui/material'

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

export const Root = styled(Box)({
  border: '1px solid #1e1e1e',
  borderRadius: 7,
  overflow: 'hidden',
})

export const RowDivider = styled(Box)({
  borderTop: '1px solid #1a1a1a',
})

export const Row = styled(Box)({
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
})

export const AvatarCircle = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: '#1e1e1e',
  flexShrink: 0,
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
})

export const TextLines = styled(Box)({
  flex: 1,
  minWidth: 0,
  paddingTop: 2,
})

export const TextLineShort = styled(Box)({
  height: 12,
  backgroundColor: '#1e1e1e',
  borderRadius: 99,
  marginBottom: 8,
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
})

export const TextLineLong = styled(Box)({
  height: 12,
  backgroundColor: '#1e1e1e',
  borderRadius: 99,
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
})
