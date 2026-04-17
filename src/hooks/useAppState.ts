import { useState, useCallback } from 'react'
import type { Board, Member, Session } from '@/core/types'
import { createDefaultBoard, MAX_BOARD_MEMBERS } from '@/core/board'

export type Screen = 'new-session' | 'active-session'

export interface AppState {
  board: Board
  sessions: Session[]
  activeSessionId: string | null
  screen: Screen
  manageBoardOpen: boolean
  addMemberOpen: boolean
  settingsOpen: boolean
  apiKey: string | null
  editingMember: Member | null
}

export function useAppState() {
  const [state, setState] = useState<AppState>({
    board: createDefaultBoard(),
    sessions: [],
    activeSessionId: null,
    screen: 'new-session',
    manageBoardOpen: false,
    addMemberOpen: false,
    settingsOpen: false,
    apiKey: null,
    editingMember: null,
  })

  const setBoard = useCallback((board: Board) => {
    setState((s) => ({ ...s, board }))
  }, [])

  const setSessions = useCallback((sessions: Session[]) => {
    setState((s) => ({ ...s, sessions }))
  }, [])

  const setActiveSession = useCallback((id: string | null) => {
    setState((s) => ({
      ...s,
      activeSessionId: id,
      screen: id ? 'active-session' : 'new-session',
    }))
  }, [])

  const setScreen = useCallback((screen: Screen) => {
    setState((s) => ({ ...s, screen }))
  }, [])

  const setManageBoardOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, manageBoardOpen: open }))
  }, [])

  const setAddMemberOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, addMemberOpen: open }))
  }, [])

  const setSettingsOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, settingsOpen: open }))
  }, [])

  const setApiKey = useCallback((apiKey: string | null) => {
    setState((s) => ({ ...s, apiKey }))
  }, [])

  const setEditingMember = useCallback((member: Member | null) => {
    setState((s) => ({
      ...s,
      editingMember: member,
      addMemberOpen: member !== null,
    }))
  }, [])

  const updateBoardMember = useCallback((updated: Member) => {
    setState((s) => ({
      ...s,
      board: {
        ...s.board,
        members: s.board.members.map((m) => (m.id === updated.id ? updated : m)),
      },
      editingMember: null,
      addMemberOpen: false,
      manageBoardOpen: true,
    }))
  }, [])

  const addMember = useCallback((member: Member) => {
    setState((s) => {
      if (s.board.members.length >= MAX_BOARD_MEMBERS) return s
      return {
        ...s,
        board: {
          ...s.board,
          members: [...s.board.members, member],
        },
        addMemberOpen: false,
        manageBoardOpen: true,
      }
    })
  }, [])

  const removeMember = useCallback((memberId: string) => {
    setState((s) => ({
      ...s,
      board: {
        ...s.board,
        members: s.board.members.filter((m) => m.id !== memberId),
      },
    }))
  }, [])

  const toggleDevilsAdvocate = useCallback(() => {
    setState((s) => ({
      ...s,
      board: {
        ...s.board,
        devilsAdvocate: !s.board.devilsAdvocate,
      },
    }))
  }, [])

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId) ?? null

  const updateSession = useCallback((session: Session) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((existing) =>
        existing.id === session.id ? session : existing
      ),
    }))
  }, [])

  const addSession = useCallback((session: Session) => {
    setState((s) => ({
      ...s,
      sessions: [session, ...s.sessions],
      activeSessionId: session.id,
      screen: 'active-session',
    }))
  }, [])

  const addToBank = useCallback((member: Member) => {
    setState((s) => {
      const existing = s.board.customBank ?? []
      // Don't add duplicates — check both id and name (case-insensitive)
      const isDuplicate = existing.some(
        (m) =>
          m.id === member.id ||
          m.name.toLowerCase() === member.name.toLowerCase()
      )
      if (isDuplicate) return s
      return {
        ...s,
        board: {
          ...s.board,
          customBank: [...existing, member],
        },
      }
    })
  }, [])

  const clearAllMemories = useCallback(() => {
    setState((s) => ({
      ...s,
      board: {
        ...s.board,
        members: s.board.members.map((member) => ({
          ...member,
          memories: [],
          condensedMemory: undefined,
        })),
      },
    }))
  }, [])

  const clearAllData = useCallback(() => {
    setState((s) => ({
      ...s,
      sessions: [],
      activeSessionId: null,
      screen: 'new-session',
      board: {
        ...s.board,
        members: s.board.members.map((member) => ({
          ...member,
          memories: [],
          condensedMemory: undefined,
        })),
        // customBank is intentionally preserved
      },
    }))
  }, [])

  const deleteSession = useCallback((sessionId: string) => {
    setState((s) => {
      const sessions = s.sessions.filter((sess) => sess.id !== sessionId)
      const wasActive = s.activeSessionId === sessionId

      // Remove memories that came from this session
      const members = s.board.members.map((member) => ({
        ...member,
        memories: member.memories.filter((m) => m.sessionId !== sessionId),
      }))

      return {
        ...s,
        sessions,
        board: { ...s.board, members },
        activeSessionId: wasActive ? null : s.activeSessionId,
        screen: wasActive ? 'new-session' : s.screen,
      }
    })
  }, [])

  return {
    state,
    activeSession,
    setBoard,
    setSessions,
    setActiveSession,
    setScreen,
    setManageBoardOpen,
    setAddMemberOpen,
    setSettingsOpen,
    setApiKey,
    addMember,
    removeMember,
    toggleDevilsAdvocate,
    updateSession,
    addSession,
    deleteSession,
    addToBank,
    clearAllMemories,
    setEditingMember,
    updateBoardMember,
    clearAllData,
  }
}
