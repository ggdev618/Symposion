// Anthropic API calls — platform-agnostic via adapter pattern
// The adapter is injected at app startup (Tauri uses plugin-http, Expo would use fetch)

export interface ApiAdapter {
  fetch(url: string, options: {
    method: string
    headers: Record<string, string>
    body: string
  }): Promise<{ status: number; text(): Promise<string> }>
}

/**
 * Hard cap on output tokens per API call.
 * 2048 tokens ≈ ~1,500 words — enough for a full board debate.
 * At Sonnet pricing ($15/MTok output), worst case per call is ~$0.03.
 */
export const MAX_OUTPUT_TOKENS = 2048

let adapter: ApiAdapter | null = null

export function setApiAdapter(a: ApiAdapter) {
  adapter = a
}

export function getApiAdapter(): ApiAdapter {
  if (!adapter) throw new Error('API adapter not set. Call setApiAdapter() at app startup.')
  return adapter
}

export async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  model: string = 'claude-sonnet-4-20250514'
): Promise<string> {
  const api = getApiAdapter()

  const response = await api.fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage },
      ],
    }),
  })

  const responseText = await response.text()

  if (response.status !== 200) {
    let errorMessage = `API error (${response.status})`
    try {
      const errorData = JSON.parse(responseText)
      errorMessage = errorData?.error?.message ?? errorMessage
    } catch {
      // use default error message
    }
    throw new Error(errorMessage)
  }

  const data = JSON.parse(responseText)
  const content = data?.content?.[0]?.text
  if (!content) {
    throw new Error('Empty response from API')
  }

  return content
}

export async function callAnthropicWithHistory(
  apiKey: string,
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  model: string = 'claude-sonnet-4-20250514'
): Promise<string> {
  const api = getApiAdapter()

  const response = await api.fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages,
    }),
  })

  const responseText = await response.text()

  if (response.status !== 200) {
    let errorMessage = `API error (${response.status})`
    try {
      const errorData = JSON.parse(responseText)
      errorMessage = errorData?.error?.message ?? errorMessage
    } catch {
      // use default error message
    }
    throw new Error(errorMessage)
  }

  const data = JSON.parse(responseText)
  const content = data?.content?.[0]?.text
  if (!content) {
    throw new Error('Empty response from API')
  }

  return content
}

/**
 * Parse JSON from API response, stripping any markdown code fences
 */
export function parseJsonResponse<T>(raw: string): T {
  // Strip markdown code fences if present
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(cleaned) as T
}
