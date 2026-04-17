export type Member = {
  id: string
  name: string
  emoji: string
  role: string
  personality: string
  condensedMemory?: string
  memories: Memory[]
}

export type Memory = {
  id: string
  date: string
  question: string
  position: string
  reasoning: string
  /** ID of the session this memory was created from. */
  sessionId?: string
}

/** Lightweight member snapshot stored with each session. */
export type MemberSnapshot = {
  id: string
  name: string
  emoji: string
  role: string
}

export type Session = {
  id: string
  date: string
  type: 'open' | 'listen'
  messages: Message[]
  verdict?: string
  tensionMap?: TensionMap
  /** Board members present when this session was created. */
  boardSnapshot?: MemberSnapshot[]
}

export type Message = {
  id: string
  role: 'user' | 'board'
  content: string
  dialogue?: DialogueLine[]
  verdict?: string
  tensionMap?: TensionMap
  /** Whether the board treated this as a yes/no decision or an open discussion. */
  questionType?: 'decision' | 'discussion'
}

export type DialogueLine = {
  memberId: string
  text: string
  finalVote?: 'yes' | 'no' | 'abstain'
}

export type TensionMap = {
  clusters: Cluster[]
  faultLines: FaultLine[]
}

export type Cluster = {
  memberIds: string[]
  position: string
}

export type FaultLine = {
  name: string
  sides: { memberIds: string[]; position: string }[]
  splitRatio: string
}

export type Board = {
  id: string
  name: string
  members: Member[]
  devilsAdvocate: boolean
  /** User-created characters saved to the bank for reuse. */
  customBank?: Member[]
}

export type Guest = {
  name: string
  emoji: string
  role: string
  personality: string
  nominatedBy: string
  reason: string
}
