
export type EntityId = number
export type ReplicatorId = number

export type Facts = any
export type Data = any
export type Memo = any
export type Broadcast = any

export type State<F = Facts> = {
	kind: string
	facts: F
}

export type Archetype = {
	facts: Facts
	data: Data
	memo: Memo
	broadcast: Broadcast
}

