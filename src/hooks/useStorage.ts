import { useEffect, useRef, useCallback } from 'react'
import type { Board, Session } from '@/core/types'

// ─── plugin-store (board + sessions — non-secret data) ──────────────────────

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

// ─── plugin-stronghold (API key — encrypted at rest) ────────────────────────

let strongholdModule: typeof import('@tauri-apps/plugin-stronghold') | null = null

const STRONGHOLD_PATH = 'symposion-vault.hold'
const STRONGHOLD_PASSWORD = 'symposion-local'
const STRONGHOLD_CLIENT = 'symposion'
const STRONGHOLD_KEY = 'anthropic-api-key'

async function getStrongholdStore() {
  if (!strongholdModule) {
    try {
      strongholdModule = await import('@tauri-apps/plugin-stronghold')
    } catch {
      console.warn('plugin-stronghold not available (running outside Tauri?)')
      return null
    }
  }
  try {
    const stronghold = await strongholdModule.Stronghold.load(STRONGHOLD_PATH, STRONGHOLD_PASSWORD)
    let client
    try {
      client = await stronghold.loadClient(STRONGHOLD_CLIENT)
    } catch {
      client = await stronghold.createClient(STRONGHOLD_CLIENT)
    }
    return { stronghold, store: client.getStore() }
  } catch (err) {
    console.error('Failed to initialize Stronghold:', err)
    return null
  }
}

async function readApiKey(): Promise<string | null> {
  const sh = await getStrongholdStore()
  if (!sh) return null
  try {
    const data = await sh.store.get(STRONGHOLD_KEY)
    if (!data || data.length === 0) return null
    return new TextDecoder().decode(data)
  } catch {
    return null
  }
}

async function writeApiKey(key: string | null): Promise<void> {
  const sh = await getStrongholdStore()
  if (!sh) return
  try {
    if (key) {
      const encoded = Array.from(new TextEncoder().encode(key))
      await sh.store.insert(STRONGHOLD_KEY, encoded)
    } else {
      await sh.store.remove(STRONGHOLD_KEY)
    }
    await sh.stronghold.save()
  } catch (err) {
    console.error('Failed to save API key to Stronghold:', err)
  }
}

/**
 * One-time migration: move a plaintext API key from plugin-store to Stronghold,
 * then delete it from the plaintext file.
 */
async function migrateApiKeyToStronghold(): Promise<string | null> {
  const store = await getStore()
  if (!store) return null

  const plaintextKey = await store.get<string>('apiKey')
  if (!plaintextKey) return null

  // Write to Stronghold, then remove from plaintext store
  await writeApiKey(plaintextKey)
  await store.delete('apiKey')
  console.info('Migrated API key from plaintext store to Stronghold')
  return plaintextKey
}

// ─── Hook ───────────────────────────────────────────────────────────────────

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
      // Load board + sessions from plaintext store
      const store = await getStore()
      if (store) {
        try {
          const board = await store.get<Board>('board')
          if (board) onBoardLoaded(board)

          const sessions = await store.get<Session[]>('sessions')
          if (sessions) onSessionsLoaded(sessions)
        } catch (err) {
          console.error('Failed to load from store:', err)
        }
      }

      // Load API key from Stronghold (with one-time migration from plaintext)
      let apiKey = await readApiKey()
      if (!apiKey) {
        apiKey = await migrateApiKeyToStronghold()
      }
      if (apiKey) onApiKeyLoaded(apiKey)
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
    await writeApiKey(key)
  }, [])

  return { saveBoard, saveSessions, saveApiKey }
}
