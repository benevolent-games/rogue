
import {Replicator} from "./replicator.js"
import {Simulas} from "../simulation/types.js"
import {FeedbackHelper} from "./feedback-helper.js"
import {Archetype, EntityId, ReplicatorId, State} from "../types.js"

export type Replon<Ar extends Archetype = any> = {
	state: State<Ar["facts"]>
	replicant: Replicant<Ar>
}

export type ReplicaPack<Re> = {
	id: number
	realm: Re
	replicator: Replicator<Re>
}

export type ReplicaImmediate<Ar extends Archetype> = {
	feedback: FeedbackHelper<Ar>
	feed: {
		facts: Ar["facts"]
		broadcasts: Ar["broadcast"][]
	}
}

export type Replicant<Ar extends Archetype> = {
	replicate: (immediate: ReplicaImmediate<Ar>) => void
	dispose: () => void
}

export type Replica<Re, Ar extends Archetype> = (pack: ReplicaPack<Re>) => Replicant<Ar>
export type Replicas = Record<string, Replica<any, any>>
export const replica = <Re>() => <Ar extends Archetype>(r: Replica<Re, Ar>) => r
export const asReplicas = <Re, S extends Simulas<Re>>(r: Record<keyof S, Replica<Re, any>>) => r

export type SpecificFeedback<Ar extends Archetype> = {data: Ar["data"], memos: Ar["memo"][]}
export type ReplicatorFeedback = [EntityId, SpecificFeedback<any>][]
export type Feedback = [ReplicatorId, ReplicatorFeedback][]
