import type { Board, Session } from '@/core/types'
import { getSessionTitle, getRelativeDate } from '@/core/session'
import {
  SidebarRoot,
  LogoWrapper,
  LogoIcon,
  LogoText,
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
  SessionButton,
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
  onNewSession: () => void
  onManageBoard: () => void
}

export function Sidebar({
  board,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onManageBoard,
}: SidebarProps) {
  return (
    <SidebarRoot component="aside">
      {/* Logo */}
      <LogoWrapper>
        <LogoIcon>🏛️</LogoIcon>
        <LogoText>Symposion</LogoText>
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
            <SessionButton
              key={session.id}
              active={session.id === activeSessionId}
              onClick={() => onSelectSession(session.id)}
              disableRipple
            >
              <SessionTitle>{getSessionTitle(session)}</SessionTitle>
              <SessionDate>{getRelativeDate(session.date)}</SessionDate>
            </SessionButton>
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
