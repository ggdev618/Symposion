import { useState, useCallback } from 'react'
import type { Board, Member, Session } from '@/core/types'
import { createDefaultBoard } from '@/core/board'

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

  const addMember = useCallback((member: Member) => {
    setState((s) => ({
      ...s,
      board: {
        ...s.board,
        members: [...s.board.members, member],
      },
      addMemberOpen: false,
      manageBoardOpen: true,
    }))
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
  }
}
