
import {Replicator} from "./replicator.js"
import {Simulas} from "../simulation/types.js"
import {FeedbackHelper} from "./feedback-helper.js"
import {EntityId, ReplicatorId, State} from "../types.js"

export type Replon<F = any> = {
	state: State<F>
	replicant: Replicant<F>
}

export type ReplicaPack = {
	id: number
	replicator: Replicator
}

export type ReplicaImmediate<F> = {
	feedback: FeedbackHelper
	feed: {
		facts: F
		broadcasts: any[]
	}
}

export type Replicant<F> = {
	replicate: (immediate: ReplicaImmediate<F>) => void
	dispose: () => void
}

export type Replica<F> = (pack: ReplicaPack) => Replicant<F>
export type Replicas = Record<string, Replica<any>>
export const replica = <F>(r: Replica<F>) => r
export const asReplicas = <S extends Simulas>(r: Record<keyof S, Replica<any>>) => r

export type SpecificFeedback = {data: any, memos: any[]}
export type ReplicatorFeedback = [EntityId, SpecificFeedback][]
export type Feedback = [ReplicatorId, ReplicatorFeedback][]

