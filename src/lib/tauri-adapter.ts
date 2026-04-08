import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import type { ApiAdapter } from '@/core/api'

/**
 * Tauri 2.0 HTTP adapter.
 * In Tauri 2.0, plugin-http's fetch() is a Web API-compatible drop-in.
 * Body is a plain string, response has .text(), .json(), .status, etc.
 */
export const tauriAdapter: ApiAdapter = {
  async fetch(url, options) {
    const response = await tauriFetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body ?? undefined,
    })

    return {
      status: response.status,
      text: () => response.text(),
    }
  },
}

/**
 * Browser/dev fallback adapter using native fetch.
 * Used when running in the browser (vite dev without tauri).
 */
export const browserAdapter: ApiAdapter = {
  async fetch(url, options) {
    const response = await globalThis.fetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    })
    return {
      status: response.status,
      text: () => response.text(),
    }
  },
}

/**
 * Detect environment and return appropriate adapter
 */
export function createAdapter(): ApiAdapter {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    return tauriAdapter
  }
  return browserAdapter
}
