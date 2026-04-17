import { useEffect, useCallback, useRef } from 'react'
import { useAppState } from '@/hooks/useAppState'
import { useSession } from '@/hooks/useSession'
import { useStorage } from '@/hooks/useStorage'
import { Sidebar } from '@/components/Sidebar'
import { ManageBoardPanel } from '@/components/ManageBoardPanel'
import { AddMemberPanel } from '@/components/AddMemberPanel'
import { SettingsModal } from '@/components/SettingsModal'
import { NewSessionScreen } from '@/screens/NewSessionScreen'
import { ActiveSessionScreen } from '@/screens/ActiveSessionScreen'
import { AppRoot, AppMain } from '@/App.styled'
import type { Member, Session } from '@/core/types'
import { generateMemberId, getMemberFromBank } from '@/core/board'
import { setApiAdapter } from '@/core/api'
import { createAdapter } from '@/lib/tauri-adapter'
import { createSession, createUserMessage } from '@/core/session'

export default function App() {
  const {
    state,
    activeSession,
    setActiveSession,
    setScreen,
    setBoard,
    setSessions,
    setManageBoardOpen,
    setAddMemberOpen,
    setSettingsOpen,
    setApiKey,
    addMember,
    addSession,
    updateSession,
    deleteSession,
    addToBank,
    clearAllMemories,
    clearAllData,
    setEditingMember,
    updateBoardMember,
  } = useAppState()

  // Initialize the API adapter on mount
  useEffect(() => {
    setApiAdapter(createAdapter())
  }, [])

  // Persistence
  const { saveBoard, saveSessions, saveApiKey } = useStorage({
    onBoardLoaded: setBoard,
    onSessionsLoaded: setSessions,
    onApiKeyLoaded: setApiKey,
  })

  // Skip writing back data that was just loaded from storage
  const hydrated = useRef(false)
  useEffect(() => {
    // Mark hydrated after the first render cycle so we don't
    // write back initial/loaded state and trigger unnecessary disk writes
    const id = requestAnimationFrame(() => { hydrated.current = true })
    return () => cancelAnimationFrame(id)
  }, [])

  // Auto-save board, sessions, and API key when they change
  useEffect(() => {
    if (hydrated.current) saveBoard(state.board)
  }, [state.board, saveBoard])

  useEffect(() => {
    if (hydrated.current) saveSessions(state.sessions)
  }, [state.sessions, saveSessions])

  useEffect(() => {
    if (hydrated.current) saveApiKey(state.apiKey)
  }, [state.apiKey, saveApiKey])

  const handleMemberUpdated = useCallback(
    (memberId: string, updates: Partial<Member>) => {
      setBoard({
        ...state.board,
        members: state.board.members.map((m) =>
          m.id === memberId ? { ...m, ...updates } : m
        ),
      })
    },
    [state.board, setBoard]
  )

  const {
    loading,
    error,
    activeGuest,
    dismissGuest,
    runOpenSession,
    runFollowUp,
    runListenSession,
    autoFillMember,
    clearError,
  } = useSession({
    apiKey: state.apiKey,
    board: state.board,
    sessions: state.sessions,
    onMemberUpdated: handleMemberUpdated,
  })

  // Handle starting a new open session
  const handleStartSession = useCallback(
    async (session: Session) => {
      if (!state.apiKey) {
        setSettingsOpen(true)
        return
      }
      addSession(session)
      const result = await runOpenSession(session)
      if (result) {
        updateSession(result)
      }
    },
    [state.apiKey, addSession, runOpenSession, updateSession, setSettingsOpen]
  )

  // Handle starting a listen session
  const handleStartListenSession = useCallback(async () => {
    if (!state.apiKey) {
      setSettingsOpen(true)
      return
    }
    const result = await runListenSession()
    if (result) {
      addSession(result)
    }
  }, [state.apiKey, runListenSession, addSession, setSettingsOpen])

  // Handle follow-up in active session
  const handleFollowUp = useCallback(
    async (session: Session, text: string) => {
      if (!state.apiKey) {
        setSettingsOpen(true)
        return
      }
      // First add the user message immediately
      const withUserMsg: Session = {
        ...session,
        messages: [...session.messages, createUserMessage(text)],
      }
      updateSession(withUserMsg)

      // Then get the board response
      const result = await runFollowUp(withUserMsg, text)
      if (result) {
        updateSession(result)
      }
    },
    [state.apiKey, runFollowUp, updateSession, setSettingsOpen]
  )

  // Handle auto-fill from add member panel
  const handleAutoFill = useCallback(
    async (
      description: string
    ): Promise<{ name: string; emoji: string; role: string; personality: string }> => {
      const result = await autoFillMember(description)
      if (result) return result
      return {
        name: description,
        emoji: '❓',
        role: 'Advisor',
        personality: `A character inspired by ${description}.`,
      }
    },
    [autoFillMember]
  )

  // Handle adding a suggested member — uses bank data first, falls back to auto-fill
  const handleAddSuggestion = useCallback(
    async (name: string) => {
      // Check the bank first — no API call needed
      const banked = getMemberFromBank(name)
      if (banked) {
        addMember(banked)
        return
      }
      // Not in bank — try auto-fill if API key exists
      if (state.apiKey) {
        const result = await autoFillMember(name)
        if (result) {
          const member: Member = {
            id: generateMemberId(result.name),
            ...result,
            memories: [],
          }
          addMember(member)
          return
        }
      }
      // Last resort fallback
      addMember({
        id: generateMemberId(name),
        name,
        emoji: '❓',
        role: '',
        personality: '',
        memories: [],
      })
    },
    [state.apiKey, autoFillMember, addMember]
  )

  // Handle starting a new session from the new session screen
  const handleNewSessionSubmit = useCallback(
    async (type: 'open' | 'listen', question?: string) => {
      if (type === 'listen') {
        await handleStartListenSession()
      } else if (question) {
        const session = createSession('open', state.board.members)
        session.messages.push(createUserMessage(question))
        await handleStartSession(session)
      }
    },
    [handleStartSession, handleStartListenSession]
  )

  return (
    <AppRoot>
      <Sidebar
        board={state.board}
        sessions={state.sessions}
        activeSessionId={state.activeSessionId}
        onSelectSession={setActiveSession}
        onDeleteSession={deleteSession}
        onNewSession={() => {
          setActiveSession(null)
          setScreen('new-session')
        }}
        onManageBoard={() => setManageBoardOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <AppMain component="main">
        {state.screen === 'new-session' && (
          <NewSessionScreen
            board={state.board}
            sessions={state.sessions}
            onStartSession={handleNewSessionSubmit}
            loading={loading}
          />
        )}
        {state.screen === 'active-session' && activeSession && (
          <ActiveSessionScreen
            session={activeSession}
            board={state.board}
            loading={loading}
            error={error}
            activeGuest={activeGuest}
            onDismissGuest={dismissGuest}
            onFollowUp={(text) => handleFollowUp(activeSession, text)}
            onOpenSettings={() => setSettingsOpen(true)}
            onClearError={clearError}
          />
        )}
      </AppMain>

      {/* Manage Board Panel */}
      <ManageBoardPanel
        board={state.board}
        isOpen={state.manageBoardOpen && !state.addMemberOpen}
        onClose={() => setManageBoardOpen(false)}
        onUpdateBoard={setBoard}
        onAddMember={() => setAddMemberOpen(true)}
        onEditMember={setEditingMember}
        onAddSuggestion={handleAddSuggestion}
        onAddFromBank={addMember}
      />

      {/* Add Member Panel */}
      <AddMemberPanel
        isOpen={state.addMemberOpen}
        onClose={() => {
          setAddMemberOpen(false)
          setEditingMember(null)
          setManageBoardOpen(true)
        }}
        onAddMember={addMember}
        onSaveToBank={addToBank}
        onUpdateMember={updateBoardMember}
        editMember={state.editingMember}
        customBank={state.board.customBank}
        onAutoFill={handleAutoFill}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={state.settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={state.apiKey}
        onSaveApiKey={setApiKey}
        onClearMemories={clearAllMemories}
        onClearAllData={clearAllData}
      />
    </AppRoot>
  )
}
