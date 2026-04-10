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
} from './SettingsModal.styled'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string | null
  onSaveApiKey: (key: string) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}: SettingsModalProps) {
  const [key, setKey] = useState(apiKey ?? '')
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    onSaveApiKey(key.trim())
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
        </ModalCard>
      </ModalContainer>
    </>
  )
}
