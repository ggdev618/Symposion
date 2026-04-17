import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { Board, Session as _Session } from '@/core/types'
import {
  Root,
  HeaderArea,
  AvatarStack,
  AvatarCircle,
  Heading,
  EmptyBoardWarning,
  InputBarWrapper,
  InputBarContainer,
  StyledTextField,
  SubmitButton,
  InputBarFooter,
  HintText,
  ListenButton,
  ListenWarning,
} from './NewSessionScreen.styled'

interface NewSessionScreenProps {
  board: Board
  sessions: _Session[]
  onStartSession: (type: 'open' | 'listen', question?: string) => void
  loading?: boolean
}

export function NewSessionScreen({ board, sessions, onStartSession, loading }: NewSessionScreenProps) {
  const [input, setInput] = useState('')
  const [listenClicked, setListenClicked] = useState(false)

  const tooFewSessions = sessions.length < 5

  const handleSubmit = () => {
    if (loading || !input.trim()) return
    onStartSession('open', input.trim())
    setInput('')
  }

  const handleListenClick = () => {
    if (tooFewSessions) {
      setListenClicked(true)
      return
    }
    onStartSession('listen')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Root>
      {/* Header area */}
      <HeaderArea>
        <AvatarStack>
          {board.members.map((member) => (
            <AvatarCircle key={member.id}>{member.emoji}</AvatarCircle>
          ))}
        </AvatarStack>

        <Heading variant="h1">
          What are you bringing
          <br />
          to the board today?
        </Heading>

        {board.members.length === 0 && (
          <EmptyBoardWarning>
            Add members to your board before starting a session.
          </EmptyBoardWarning>
        )}
      </HeaderArea>

      {/* Input bar */}
      <InputBarWrapper>
        <InputBarContainer>
          <StyledTextField
            value={input}
            onChange={(e) => { setInput(e.target.value); setListenClicked(false) }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Describe a decision, plan, or situation…"
            multiline
            rows={2}
            fullWidth
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            disableRipple
          >
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ArrowForwardIcon />
            )}
          </SubmitButton>
        </InputBarContainer>

        <InputBarFooter>
          <HintText>
            Pressure test and steelman are available once inside a session.
          </HintText>
          <div>
            <ListenButton onClick={handleListenClick} disabled={loading} disableRipple>
              🔇 Just listen
            </ListenButton>
            {listenClicked && tooFewSessions && (
              <ListenWarning>
                Come back after a few more sessions.
              </ListenWarning>
            )}
          </div>
        </InputBarFooter>
      </InputBarWrapper>
    </Root>
  )
}
