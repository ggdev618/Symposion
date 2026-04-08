import { useEffect, useRef, useCallback } from 'react'
import type { Board, Session } from '@/core/types'

// Dynamic import to avoid breaking when not in Tauri
let storeModule: typeof import('@tauri-apps/plugin-store') | null = null

async function getStore() {
  if (!storeModule) {
    try {
      storeModule = await import('@tauri-apps/plugin-store')
    } catch {
      console.warn('plugin-store not available (running outside Tauri?)')
      return null
    }
  }
  try {
    return await storeModule.load('symposion-data.json', { autoSave: true, defaults: {} })
  } catch {
    return null
  }
}

export function useStorage({
  onBoardLoaded,
  onSessionsLoaded,
  onApiKeyLoaded,
}: {
  onBoardLoaded: (board: Board) => void
  onSessionsLoaded: (sessions: Session[]) => void
  onApiKeyLoaded: (key: string | null) => void
}) {
  const initialized = useRef(false)

  // Load data on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    ;(async () => {
      const store = await getStore()
      if (!store) return

      try {
        const board = await store.get<Board>('board')
        if (board) onBoardLoaded(board)

        const sessions = await store.get<Session[]>('sessions')
        if (sessions) onSessionsLoaded(sessions)

        const apiKey = await store.get<string>('apiKey')
        if (apiKey) onApiKeyLoaded(apiKey)
      } catch (err) {
        console.error('Failed to load from store:', err)
      }
    })()
  }, [onBoardLoaded, onSessionsLoaded, onApiKeyLoaded])

  const saveBoard = useCallback(async (board: Board) => {
    const store = await getStore()
    if (store) {
      await store.set('board', board)
    }
  }, [])

  const saveSessions = useCallback(async (sessions: Session[]) => {
    const store = await getStore()
    if (store) {
      await store.set('sessions', sessions)
    }
  }, [])

  const saveApiKey = useCallback(async (key: string | null) => {
    const store = await getStore()
    if (store) {
      if (key) {
        await store.set('apiKey', key)
      } else {
        await store.delete('apiKey')
      }
    }
  }, [])

  return { saveBoard, saveSessions, saveApiKey }
}
