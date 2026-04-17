import type { Board, Session } from '@/core/types'
import { getSessionTitle, getRelativeDate } from '@/core/session'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  SidebarRoot,
  LogoWrapper,
  LogoLeft,
  LogoIcon,
  LogoText,
  SettingsButton,
  MembersSection,
  SectionLabel,
  MemberList,
  MemberRow,
  MemberAvatar,
  MemberInfo,
  MemberName,
  MemberRole,
  ManageBoardButton,
  ManageBoardIcon,
  ManageBoardLabel,
  SidebarDivider,
  SessionsSection,
  SessionList,
  SessionRow,
  SessionButton,
  SessionDeleteButton,
  SessionTitle,
  SessionDate,
  NewSessionWrapper,
  NewSessionButton,
} from './Sidebar.styled'

interface SidebarProps {
  board: Board
  sessions: Session[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onNewSession: () => void
  onManageBoard: () => void
  onOpenSettings: () => void
}

export function Sidebar({
  board,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  onManageBoard,
  onOpenSettings,
}: SidebarProps) {
  return (
    <SidebarRoot component="aside">
      {/* Logo */}
      <LogoWrapper>
        <LogoLeft>
          <LogoIcon>🏛️</LogoIcon>
          <LogoText>Symposion</LogoText>
        </LogoLeft>
        <SettingsButton onClick={onOpenSettings} size="small">
          <SettingsIcon />
        </SettingsButton>
      </LogoWrapper>

      {/* Members */}
      <MembersSection>
        <SectionLabel>Members</SectionLabel>
        <MemberList>
          {board.members.map((member) => (
            <MemberRow key={member.id}>
              <MemberAvatar>{member.emoji}</MemberAvatar>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                {member.role && <MemberRole>{member.role}</MemberRole>}
              </MemberInfo>
            </MemberRow>
          ))}
        </MemberList>

        {/* Manage board */}
        <ManageBoardButton onClick={onManageBoard} disableRipple>
          <ManageBoardIcon className="manage-icon">+</ManageBoardIcon>
          <ManageBoardLabel className="manage-label">
            Manage board
          </ManageBoardLabel>
        </ManageBoardButton>
      </MembersSection>

      {/* Divider */}
      <SidebarDivider />

      {/* Recent sessions */}
      <SessionsSection>
        <SectionLabel>Recent</SectionLabel>
        <SessionList>
          {sessions.map((session) => (
            <SessionRow key={session.id}>
              <SessionButton
                active={session.id === activeSessionId}
                onClick={() => onSelectSession(session.id)}
                disableRipple
              >
                <SessionTitle>{getSessionTitle(session)}</SessionTitle>
                <SessionDate>{getRelativeDate(session.date)}</SessionDate>
              </SessionButton>
              <SessionDeleteButton
                className="session-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSession(session.id)
                }}
                size="small"
              >
                <CloseIcon />
              </SessionDeleteButton>
            </SessionRow>
          ))}
        </SessionList>
      </SessionsSection>

      {/* New session button */}
      <NewSessionWrapper>
        <NewSessionButton onClick={onNewSession} disableRipple>
          + New session
        </NewSessionButton>
      </NewSessionWrapper>
    </SidebarRoot>
  )
}
