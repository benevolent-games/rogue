
export type EntityId = number
export type ReplicatorId = number

export type State<F = any> = {
	kind: string
	facts: F
}

export type Archetype = {
	facts: any
	data: any
	memo: any
	broadcast: any
}

