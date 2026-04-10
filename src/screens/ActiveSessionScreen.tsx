import { useState, useRef, useEffect } from 'react'
import { CircularProgress } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { Session, Board, Message, Member, Guest } from '@/core/types'
import { getSessionTitle } from '@/core/session'
import { TensionMap } from '@/components/TensionMap'
import { LoadingDialogue } from '@/components/LoadingDialogue'
import {
  Root,
  TopBar,
  TopBarTitle,
  TopBarActions,
  TopBarButton,
  ChipBar,
  MemberChip,
  ChipEmojiIcon,
  SessionBody,
  ListenModeHeader,
  ListenModeLabel,
  LoadingWrapper,
  ListeningIndicator,
  ListeningDot,
  ListeningText,
  ErrorBox,
  ErrorInner,
  ErrorText,
  ErrorCloseButton,
  InputBarSection,
  InputBarContainer,
  StyledTextField,
  SubmitButton,
  MessageWrapper,
  UserQuestionLabel,
  UserQuestionText,
  DialogueContainer,
  DialogueDivider,
  DialogueLineWrapper,
  GuestSummonedLabel,
  DialogueLineHeader,
  SpeakerInfo,
  SpeakerEmoji,
  SpeakerName,
  VotePill,
  DismissGuestButton,
  DialogueText,
  VerdictBox,
  VerdictLabel,
  VerdictText,
} from './ActiveSessionScreen.styled'

interface ActiveSessionScreenProps {
  session: Session
  board: Board
  loading?: boolean
  error?: string | null
  activeGuest?: Guest | null
  onDismissGuest?: () => void
  onFollowUp?: (text: string) => void
  onOpenSettings?: () => void
  onClearError?: () => void
}

export function ActiveSessionScreen({
  session,
  board,
  loading,
  error,
  activeGuest,
  onDismissGuest,
  onFollowUp,
  onOpenSettings,
  onClearError,
}: ActiveSessionScreenProps) {
  const title = getSessionTitle(session)
  const [followUp, setFollowUp] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const memberMap = Object.fromEntries(board.members.map((m) => [m.id, m]))

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [session.messages.length, loading])

  const handleFollowUp = () => {
    if (!followUp.trim() || !onFollowUp || loading) return
    onFollowUp(followUp.trim())
    setFollowUp('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFollowUp()
    }
  }

  return (
    <Root>
      {/* Top bar */}
      <TopBar>
        <TopBarTitle>{title}</TopBarTitle>
        <TopBarActions>
          <TopBarButton
            size="small"
            startIcon={<DownloadIcon />}
            disableRipple
          >
            Export
          </TopBarButton>
          <TopBarButton
            onClick={onOpenSettings}
            size="small"
            startIcon={<SettingsIcon />}
            disableRipple
          >
            Settings
          </TopBarButton>
        </TopBarActions>
      </TopBar>

      {/* Member chips */}
      <ChipBar>
        {board.members.map((member) => (
          <MemberChip
            key={member.id}
            label={member.name}
            icon={<ChipEmojiIcon component="span">{member.emoji}</ChipEmojiIcon>}
            variant="outlined"
            size="small"
          />
        ))}
      </ChipBar>

      {/* Session body */}
      <SessionBody ref={scrollRef}>
        {/* Listen mode header */}
        {session.type === 'listen' && (
          <ListenModeHeader>
            <ListenModeLabel>They don't know you're reading this</ListenModeLabel>
          </ListenModeHeader>
        )}

        {session.messages.map((message) => (
          <MessageBlock
            key={message.id}
            message={message}
            memberMap={memberMap}
            members={board.members}
            isListenMode={session.type === 'listen'}
            activeGuest={activeGuest}
            onDismissGuest={onDismissGuest}
          />
        ))}

        {/* Loading state */}
        {loading && (
          <LoadingWrapper>
            {session.type === 'listen' && (
              <ListeningIndicator>
                <ListeningDot />
                <ListeningText>Still listening</ListeningText>
              </ListeningIndicator>
            )}
            <LoadingDialogue memberCount={board.members.length} />
          </LoadingWrapper>
        )}

        {/* Error state */}
        {error && (
          <ErrorBox>
            <ErrorInner>
              <ErrorText>{error}</ErrorText>
              {onClearError && (
                <ErrorCloseButton onClick={onClearError} size="small">
                  <CloseIcon />
                </ErrorCloseButton>
              )}
            </ErrorInner>
          </ErrorBox>
        )}
      </SessionBody>

      {/* Input bar — only for open sessions */}
      {session.type === 'open' && (
        <InputBarSection>
          <InputBarContainer>
            <StyledTextField
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Follow up, push back, or ask something new…"
              multiline
              rows={2}
              fullWidth
            />
            <SubmitButton
              onClick={handleFollowUp}
              disabled={!followUp.trim() || loading}
              disableRipple
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ArrowForwardIcon />
              )}
            </SubmitButton>
          </InputBarContainer>
        </InputBarSection>
      )}
    </Root>
  )
}

// ─── Message Block ──────────────────────────────────────

function MessageBlock({
  message,
  memberMap,
  members,
  isListenMode,
  activeGuest,
  onDismissGuest,
}: {
  message: Message
  memberMap: Record<string, Member>
  members: Member[]
  isListenMode?: boolean
  activeGuest?: Guest | null
  onDismissGuest?: () => void
}) {
  if (message.role === 'user') {
    return (
      <MessageWrapper>
        <UserQuestionLabel>Question</UserQuestionLabel>
        <UserQuestionText>{message.content}</UserQuestionText>
      </MessageWrapper>
    )
  }

  return (
    <MessageWrapper>
      {message.dialogue && (
        <DialogueContainer>
          {message.dialogue.map((line, i) => {
            const member = memberMap[line.memberId]
            const isDevilsAdvocate = line.memberId === 'devil'
            const isGuest = activeGuest && !member && !isDevilsAdvocate
            const isFirst = message.dialogue!.findIndex((d) => d.memberId === line.memberId) === i

            let displayEmoji = member?.emoji ?? '❓'
            let displayName = member?.name ?? line.memberId

            if (isDevilsAdvocate) {
              displayEmoji = '⚖️'
              displayName = "Devil's advocate"
            } else if (isGuest && activeGuest) {
              displayEmoji = activeGuest.emoji
              displayName = activeGuest.name
            }

            return (
              <div key={i}>
                {i > 0 && <DialogueDivider />}
                <DialogueLineWrapper>
                  {/* Guest summoned-by label */}
                  {isGuest && isFirst && activeGuest && (
                    <GuestSummonedLabel>
                      summoned by {memberMap[activeGuest.nominatedBy]?.name ?? activeGuest.nominatedBy}
                    </GuestSummonedLabel>
                  )}

                  <DialogueLineHeader>
                    <SpeakerInfo>
                      <SpeakerEmoji component="span">{displayEmoji}</SpeakerEmoji>
                      <SpeakerName
                        component="span"
                        isFirst={isFirst}
                        isDevil={isDevilsAdvocate}
                      >
                        {displayName}
                      </SpeakerName>
                      {line.finalVote && !isListenMode && (
                        <VotePill component="span" vote={line.finalVote}>
                          {line.finalVote.charAt(0).toUpperCase() + line.finalVote.slice(1)}
                        </VotePill>
                      )}
                    </SpeakerInfo>

                    {isGuest && onDismissGuest && (
                      <DismissGuestButton onClick={onDismissGuest} size="small">
                        <CloseIcon />
                      </DismissGuestButton>
                    )}
                  </DialogueLineHeader>

                  <DialogueText>{line.text}</DialogueText>
                </DialogueLineWrapper>
              </div>
            )
          })}
        </DialogueContainer>
      )}

      {/* Tension map */}
      {message.tensionMap && !isListenMode && (
        <TensionMap tensionMap={message.tensionMap} members={members} />
      )}

      {/* Verdict */}
      {message.verdict && !isListenMode && (
        <VerdictBox>
          <VerdictLabel>Verdict</VerdictLabel>
          <VerdictText>{message.verdict}</VerdictText>
        </VerdictBox>
      )}
    </MessageWrapper>
  )
}
