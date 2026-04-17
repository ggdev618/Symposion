import { useState } from 'react'
import { InputAdornment } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Backdrop,
  ModalContainer,
  ModalCard,
  Header,
  HeaderTitle,
  CloseButton,
  Content,
  FieldLabel,
  ApiKeyField,
  ToggleVisibilityButton,
  Footer,
  SaveButton,
  DangerSection,
  DangerLabel,
  DangerButton,
} from './SettingsModal.styled'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string | null
  onSaveApiKey: (key: string) => void
  onClearMemories?: () => void
  onClearAllData?: () => void
}

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  onClearMemories,
  onClearAllData,
}: SettingsModalProps) {
  const [key, setKey] = useState(apiKey ?? '')
  const [showKey, setShowKey] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  const handleSave = () => {
    onSaveApiKey(key.trim())
    onClose()
  }

  const handleClearMemories = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    onClearMemories?.()
    setConfirmClear(false)
    onClose()
  }

  const handleClearAllData = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true)
      return
    }
    onClearAllData?.()
    setConfirmClearAll(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <Backdrop onClick={onClose} />

      {/* Modal */}
      <ModalContainer>
        <ModalCard onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <Header>
            <HeaderTitle>Settings</HeaderTitle>
            <CloseButton onClick={onClose} size="small">
              <CloseIcon />
            </CloseButton>
          </Header>

          {/* Content */}
          <Content>
            <FieldLabel>API key</FieldLabel>
            <ApiKeyField
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              size="small"
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <ToggleVisibilityButton
                        onClick={() => setShowKey(!showKey)}
                        size="small"
                      >
                        {showKey ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </ToggleVisibilityButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Content>

          {/* Footer */}
          <Footer>
            <SaveButton onClick={handleSave} disableRipple>
              Save
            </SaveButton>
          </Footer>

          {/* Danger zone */}
          {(onClearMemories || onClearAllData) && (
            <DangerSection>
              <DangerLabel>Danger zone</DangerLabel>
              {onClearMemories && (
                <DangerButton
                  onClick={handleClearMemories}
                  disableRipple
                  onBlur={() => setConfirmClear(false)}
                  style={{ marginBottom: onClearAllData ? 8 : 0 }}
                >
                  {confirmClear
                    ? 'Are you sure? Click again to confirm'
                    : 'Clear all board memories'}
                </DangerButton>
              )}
              {onClearAllData && (
                <DangerButton
                  onClick={handleClearAllData}
                  disableRipple
                  onBlur={() => setConfirmClearAll(false)}
                >
                  {confirmClearAll
                    ? 'Are you sure? Click again to confirm'
                    : 'Clear all chats & memories'}
                </DangerButton>
              )}
            </DangerSection>
          )}
        </ModalCard>
      </ModalContainer>
    </>
  )
}
