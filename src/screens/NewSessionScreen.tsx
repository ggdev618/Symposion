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
  CardGrid,
  SessionCard,
  CardEmoji,
  CardTitle,
  CardDescription,
  CardWarning,
  EmptyBoardWarning,
  InputBarWrapper,
  InputBarContainer,
  StyledTextField,
  SubmitButton,
  HintText,
} from './NewSessionScreen.styled'

interface NewSessionScreenProps {
  board: Board
  sessions: _Session[]
  onStartSession: (type: 'open' | 'listen', question?: string) => void
  loading?: boolean
}

export function NewSessionScreen({ board, sessions, onStartSession, loading }: NewSessionScreenProps) {
  const [sessionType, setSessionType] = useState<'open' | 'listen' | null>(null)
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (loading) return
    if (sessionType === 'listen') {
      onStartSession('listen')
      setSessionType(null)
      return
    }
    if (!input.trim()) return
    onStartSession('open', input.trim())
    setInput('')
    setSessionType(null)
  }

  const handleListenClick = () => {
    setSessionType('listen')
    if (sessionType === 'listen') {
      onStartSession('listen')
      setSessionType(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const tooFewSessions = sessions.length < 5

  return (
    <Root>
      {/* Header area */}
      <HeaderArea>
        {/* Member avatar stack */}
        <AvatarStack>
          {board.members.map((member) => (
            <AvatarCircle key={member.id}>{member.emoji}</AvatarCircle>
          ))}
        </AvatarStack>

        {/* Heading */}
        <Heading variant="h1">
          What are you bringing
          <br />
          to the board today?
        </Heading>

        {/* Session type cards */}
        <CardGrid>
          <SessionCard
            onClick={() => setSessionType('open')}
            disabled={loading}
            selected={sessionType === 'open'}
            disableRipple
          >
            <CardEmoji>💬</CardEmoji>
            <CardTitle>Open session</CardTitle>
            <CardDescription>Ask anything. The board debates and responds.</CardDescription>
          </SessionCard>

          <SessionCard
            onClick={handleListenClick}
            disabled={loading}
            selected={sessionType === 'listen'}
            disableRipple
          >
            <CardEmoji>🔇</CardEmoji>
            <CardTitle>Just listen</CardTitle>
            <CardDescription>
              Say nothing. The board talks among themselves about you.
            </CardDescription>
            {tooFewSessions && sessionType === 'listen' && (
              <CardWarning>
                Come back after a few more sessions. The board needs to know you first.
              </CardWarning>
            )}
          </SessionCard>
        </CardGrid>

        {/* Empty board warning */}
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
            onChange={(e) => setInput(e.target.value)}
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
        <HintText>
          Pressure test and steelman are available once inside a session.
        </HintText>
      </InputBarWrapper>
    </Root>
  )
}
