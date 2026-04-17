import { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import type { Member } from '@/core/types'
import { generateMemberId } from '@/core/board'
import {
  Backdrop,
  Panel,
  Header,
  BackButton,
  HeaderTitle,
  Content,
  SectionLabel,
  AutoFillSection,
  AutoFillRow,
  StyledTextField,
  FillButton,
  DividerWrapper,
  DividerLine,
  DividerBorder,
  DividerLabelWrap,
  DividerLabel,
  FormFields,
  FieldLabelRow,
  FieldLabel,
  EmojiRow,
  EmojiPreview,
  Footer,
  FooterButtons,
  SubmitButton,
  SaveToBankButton,
  MissingFieldsHint,
  AiFilledChip,
} from './AddMemberPanel.styled'
import { Box } from '@mui/material'

interface AddMemberPanelProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (member: Member) => void
  onSaveToBank: (member: Member) => void
  onUpdateMember?: (member: Member) => void
  editMember?: Member | null
  customBank?: Member[]
  onAutoFill: (description: string) => Promise<{
    name: string
    emoji: string
    role: string
    personality: string
  }>
}

function AiFilledTag() {
  return (
    <AiFilledChip component="span">
      <AutoAwesomeIcon />
      AI filled
    </AiFilledChip>
  )
}

export function AddMemberPanel({
  isOpen,
  onClose,
  onAddMember,
  onSaveToBank,
  onUpdateMember,
  editMember,
  customBank = [],
  onAutoFill,
}: AddMemberPanelProps) {
  const isEditMode = !!editMember

  const [autoFillInput, setAutoFillInput] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [emoji, setEmoji] = useState('')
  const [personality, setPersonality] = useState('')
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set())
  const [isAutoFilling, setIsAutoFilling] = useState(false)

  // Populate fields when entering edit mode
  useEffect(() => {
    if (isOpen && editMember) {
      setName(editMember.name)
      setRole(editMember.role)
      setEmoji(editMember.emoji)
      setPersonality(editMember.personality)
      setFilledFields(new Set())
      setAutoFillInput('')
    }
  }, [isOpen, editMember])

  const resetForm = () => {
    setAutoFillInput('')
    setName('')
    setRole('')
    setEmoji('')
    setPersonality('')
    setFilledFields(new Set())
    setIsAutoFilling(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleAutoFill = async () => {
    if (!autoFillInput.trim() || isAutoFilling) return
    setIsAutoFilling(true)
    try {
      const result = await onAutoFill(autoFillInput.trim())
      setName(result.name)
      setEmoji(result.emoji)
      setRole(result.role)
      setPersonality(result.personality)
      setFilledFields(new Set(['name', 'emoji', 'role', 'personality']))
    } finally {
      setIsAutoFilling(false)
    }
  }

  const buildMember = (): Member => ({
    // In edit mode, preserve the original id and memories
    id: editMember?.id ?? generateMemberId(name),
    name: name.trim(),
    emoji: emoji.trim() || '?',
    role: role.trim(),
    personality: personality.trim(),
    memories: editMember?.memories ?? [],
    condensedMemory: editMember?.condensedMemory,
  })

  const handleSubmit = () => {
    if (!name.trim()) return
    onAddMember(buildMember())
    resetForm()
  }

  const handleUpdate = () => {
    if (!canSubmit) return
    onUpdateMember?.(buildMember())
    resetForm()
  }

  const handleSaveToBank = () => {
    if (!canSubmit) return
    onSaveToBank(buildMember())
    resetForm()
  }

  const clearField = (field: string) => {
    setFilledFields((s) => {
      const next = new Set(s)
      next.delete(field)
      return next
    })
  }

  const missingFields = [
    !name.trim() && 'name',
    !role.trim() && 'role',
    !emoji.trim() && 'emoji',
    !personality.trim() && 'personality',
  ].filter(Boolean) as string[]
  const canSubmit = missingFields.length === 0

  const isAlreadyInBank = customBank.some(
    (m) =>
      (editMember && m.id === editMember.id) ||
      (name.trim() && m.name.toLowerCase() === name.trim().toLowerCase())
  )

  return (
    <>
      {/* Backdrop */}
      <Backdrop open={isOpen} onClick={handleClose} />

      {/* Panel */}
      <Panel open={isOpen}>
        {/* Header */}
        <Header>
          <BackButton onClick={handleClose} size="small">
            <ArrowBackIcon />
          </BackButton>
          <HeaderTitle>{isEditMode ? 'Edit member' : 'Add member'}</HeaderTitle>
        </Header>

        {/* Content */}
        <Content>
          {/* Auto-fill section — hidden in edit mode */}
          {!isEditMode && (
            <>
              <AutoFillSection>
                <SectionLabel>
                  Describe any real or fictional character
                </SectionLabel>
                <AutoFillRow>
                  <StyledTextField
                    value={autoFillInput}
                    onChange={(e) => setAutoFillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAutoFill() }}
                    placeholder="e.g. Elon Musk, Gandalf, Marie Curie..."
                    size="small"
                    fullWidth
                  />
                  <FillButton
                    onClick={handleAutoFill}
                    disabled={!autoFillInput.trim() || isAutoFilling}
                    disableRipple
                    startIcon={<AutoAwesomeIcon />}
                  >
                    Fill
                  </FillButton>
                </AutoFillRow>
              </AutoFillSection>

              {/* Divider */}
              <DividerWrapper>
                <DividerLine>
                  <DividerBorder />
                </DividerLine>
                <DividerLabelWrap>
                  <DividerLabel>or fill manually</DividerLabel>
                </DividerLabelWrap>
              </DividerWrapper>
            </>
          )}

          {/* Form fields */}
          <FormFields>
            {/* Name */}
            <Box>
              <FieldLabelRow>
                <FieldLabel>Name</FieldLabel>
                {filledFields.has('name') && <AiFilledTag />}
              </FieldLabelRow>
              <StyledTextField
                value={name}
                onChange={(e) => { setName(e.target.value); clearField('name') }}
                placeholder="Character name"
                size="small"
                fullWidth
              />
            </Box>

            {/* Role */}
            <Box>
              <FieldLabelRow>
                <FieldLabel>Role</FieldLabel>
                {filledFields.has('role') && <AiFilledTag />}
              </FieldLabelRow>
              <StyledTextField
                value={role}
                onChange={(e) => { setRole(e.target.value); clearField('role') }}
                placeholder="e.g. Strategist, Devil's advocate"
                size="small"
                fullWidth
              />
            </Box>

            {/* Emoji */}
            <Box>
              <FieldLabelRow>
                <FieldLabel>Emoji</FieldLabel>
                {filledFields.has('emoji') && <AiFilledTag />}
              </FieldLabelRow>
              <EmojiRow>
                <StyledTextField
                  value={emoji}
                  onChange={(e) => { setEmoji(e.target.value); clearField('emoji') }}
                  placeholder="Pick an emoji"
                  size="small"
                  fullWidth
                />
                <EmojiPreview>{emoji || '?'}</EmojiPreview>
              </EmojiRow>
            </Box>

            {/* Personality */}
            <Box>
              <FieldLabelRow>
                <FieldLabel>Personality</FieldLabel>
                {filledFields.has('personality') && <AiFilledTag />}
              </FieldLabelRow>
              <StyledTextField
                value={personality}
                onChange={(e) => { setPersonality(e.target.value); clearField('personality') }}
                placeholder="How they think, argue, and what they value..."
                size="small"
                fullWidth
                multiline
                rows={4}
              />
            </Box>
          </FormFields>
        </Content>

        {/* Footer */}
        <Footer>
          <FooterButtons>
            {isEditMode ? (
              <SubmitButton
                onClick={handleUpdate}
                disabled={!canSubmit}
                disableRipple
              >
                Save changes
              </SubmitButton>
            ) : (
              <SubmitButton
                onClick={handleSubmit}
                disabled={!canSubmit}
                disableRipple
              >
                Add to board
              </SubmitButton>
            )}
            <SaveToBankButton
              onClick={handleSaveToBank}
              disabled={!canSubmit || isAlreadyInBank}
              disableRipple
            >
              {isAlreadyInBank ? 'Already in bank' : 'Save to bank'}
            </SaveToBankButton>
          </FooterButtons>
          {missingFields.length > 0 && missingFields.length < 4 && (
            <MissingFieldsHint>
              Still needed: {missingFields.join(', ')}
            </MissingFieldsHint>
          )}
        </Footer>
      </Panel>
    </>
  )
}
