
export type EntityId = number
export type ReplicatorId = number

export type State<F = any> = {
	kind: string
	facts: F
}

