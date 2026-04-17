import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const AppRoot = styled(Box)({
  display: 'flex',
  width: '100%',
  height: '100%',
})

export const AppMain = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  backgroundColor: '#111',
}) as typeof Box
