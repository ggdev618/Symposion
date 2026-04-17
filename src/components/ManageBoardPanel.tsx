import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import type { Board, Member } from '@/core/types'
import { SUGGESTED_MEMBERS, MAX_BOARD_MEMBERS } from '@/core/board'
import {
  Backdrop,
  Panel,
  Header,
  HeaderTitle,
  CloseButton,
  Content,
  MemberGrid,
  MemberCard,
  RemoveButton,
  EditButton,
  EmojiCircle,
  MemberName,
  MemberRole,
  MemberPersonality,
  AddMemberButton,
  AddIconCircle,
  AddLabel,
  BoardFullNote,
  DevilsAdvocateRow,
  DevilsAdvocateLabel,
  StyledSwitch,
  SuggestionsSection,
  SuggestionsTitle,
  SuggestionsWrap,
  SuggestionChip,
  CustomBankChip,
} from './ManageBoardPanel.styled'

interface ManageBoardPanelProps {
  board: Board
  isOpen: boolean
  onClose: () => void
  onUpdateBoard: (board: Board) => void
  onAddMember: () => void
  onEditMember: (member: Member) => void
  onAddSuggestion: (name: string) => void
  onAddFromBank: (member: Member) => void
}

export function ManageBoardPanel({
  board,
  isOpen,
  onClose,
  onUpdateBoard,
  onAddMember,
  onEditMember,
  onAddSuggestion,
  onAddFromBank,
}: ManageBoardPanelProps) {
  const customBank = board.customBank ?? []
  const isFull = board.members.length >= MAX_BOARD_MEMBERS

  const removeMember = (memberId: string) => {
    onUpdateBoard({
      ...board,
      members: board.members.filter((m) => m.id !== memberId),
    })
  }

  const toggleDevilsAdvocate = () => {
    onUpdateBoard({
      ...board,
      devilsAdvocate: !board.devilsAdvocate,
    })
  }

  return (
    <>
      {/* Backdrop */}
      <Backdrop open={isOpen} onClick={onClose} />

      {/* Panel */}
      <Panel open={isOpen}>
        {/* Header */}
        <Header>
          <HeaderTitle>Your board</HeaderTitle>
          <CloseButton onClick={onClose} size="small">
            <CloseIcon />
          </CloseButton>
        </Header>

        {/* Content */}
        <Content>
          {/* Member grid */}
          <MemberGrid>
            {board.members.map((member) => (
              <MemberCard key={member.id}>
                {/* Edit button */}
                <EditButton
                  className="edit-btn"
                  onClick={() => onEditMember(member)}
                  size="small"
                >
                  <EditIcon />
                </EditButton>

                {/* Remove button */}
                <RemoveButton
                  className="remove-btn"
                  onClick={() => removeMember(member.id)}
                  size="small"
                >
                  <CloseIcon />
                </RemoveButton>

                {/* Emoji */}
                <EmojiCircle>{member.emoji}</EmojiCircle>

                {/* Name & role */}
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>

                {/* Personality snippet */}
                <MemberPersonality>{member.personality}</MemberPersonality>
              </MemberCard>
            ))}

            {/* Add member card */}
            {!isFull && (
              <AddMemberButton onClick={onAddMember} disableRipple>
                <AddIconCircle className="add-icon">+</AddIconCircle>
                <AddLabel className="add-label">Add member</AddLabel>
              </AddMemberButton>
            )}
          </MemberGrid>

          {/* Board full note */}
          {isFull && (
            <BoardFullNote>
              Board is full ({MAX_BOARD_MEMBERS}/{MAX_BOARD_MEMBERS}). Remove a member to add someone new.
            </BoardFullNote>
          )}

          {/* Devil's advocate toggle */}
          <DevilsAdvocateRow>
            <DevilsAdvocateLabel
              component="label"
              htmlFor="devils-advocate"
            >
              Devil's advocate seat
            </DevilsAdvocateLabel>
            <StyledSwitch
              id="devils-advocate"
              checked={board.devilsAdvocate}
              onChange={toggleDevilsAdvocate}
              size="small"
            />
          </DevilsAdvocateRow>

          {/* Custom bank */}
          {customBank.length > 0 && (
            <SuggestionsSection>
              <SuggestionsTitle>Your characters</SuggestionsTitle>
              <SuggestionsWrap>
                {customBank.map((member) => {
                  const alreadyAdded = board.members.some((m) => m.id === member.id)
                  return (
                    <CustomBankChip
                      key={member.id}
                      onClick={() => onAddFromBank(member)}
                      disabled={alreadyAdded || isFull}
                      disableRipple
                    >
                      {member.emoji} {member.name}
                    </CustomBankChip>
                  )
                })}
              </SuggestionsWrap>
            </SuggestionsSection>
          )}

          {/* Suggestions — hide any that are already in the custom bank */}
          <SuggestionsSection>
            <SuggestionsTitle>Suggestions</SuggestionsTitle>
            <SuggestionsWrap>
              {SUGGESTED_MEMBERS.filter(
                (suggestion) =>
                  !customBank.some(
                    (m) => m.name.toLowerCase() === suggestion.name.toLowerCase()
                  )
              ).map((suggestion) => {
                const alreadyAdded = board.members.some(
                  (m) => m.name.toLowerCase() === suggestion.name.toLowerCase()
                )
                return (
                  <SuggestionChip
                    key={suggestion.name}
                    onClick={() => onAddSuggestion(suggestion.name)}
                    disabled={alreadyAdded || isFull}
                    disableRipple
                  >
                    {suggestion.name}
                  </SuggestionChip>
                )
              })}
            </SuggestionsWrap>
          </SuggestionsSection>
        </Content>
      </Panel>
    </>
  )
}
