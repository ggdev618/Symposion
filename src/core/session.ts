import type { Session, Message, DialogueLine, Member } from './types'

export function createSession(type: 'open' | 'listen', members?: Member[]): Session {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type,
    messages: [],
    boardSnapshot: members?.map(({ id, name, emoji, role }) => ({ id, name, emoji, role })),
  }
}

export function createUserMessage(content: string): Message {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    content,
  }
}

export function createBoardMessage(
  content: string,
  dialogue: DialogueLine[],
  verdict?: string,
  tensionMap?: Message['tensionMap'],
  questionType?: Message['questionType']
): Message {
  return {
    id: crypto.randomUUID(),
    role: 'board',
    content,
    dialogue,
    verdict,
    tensionMap,
    questionType,
  }
}

export function getSessionTitle(session: Session): string {
  const firstUserMsg = session.messages.find((m) => m.role === 'user')
  if (firstUserMsg) {
    const title = firstUserMsg.content
    return title.length > 60 ? title.slice(0, 60) + '…' : title
  }
  return 'Untitled session'
}

export function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}
