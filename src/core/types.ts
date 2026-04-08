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
}

export type Session = {
  id: string
  date: string
  type: 'open' | 'listen'
  messages: Message[]
  verdict?: string
  tensionMap?: TensionMap
}

export type Message = {
  id: string
  role: 'user' | 'board'
  content: string
  dialogue?: DialogueLine[]
  verdict?: string
  tensionMap?: TensionMap
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
}

export type Guest = {
  name: string
  emoji: string
  role: string
  personality: string
  nominatedBy: string
  reason: string
}
