
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

// export namespace FeedEvent {
// 	export type Create = {kind: "create", entityId: number, state: State}
// 	export type Facts = {kind: "facts", entityId: number, facts: any}
// 	export type Broadcast = {kind: "broadcast", entityId: number, broadcast: any}
// 	export type Destroy = {kind: "destroy", entityId: number}
//
// 	export type Any = Create | Facts | Broadcast | Destroy
// 	export type Kind = Any["kind"]
// }
//
// export namespace FeedbackEvent {
// 	export type Data = {kind: "data", entityId: number, data: any}
// 	export type Memo = {kind: "memo", entityId: number, memo: any}
//
// 	export type Any = Data | Memo
// 	export type Kind = Any["kind"]
// }

