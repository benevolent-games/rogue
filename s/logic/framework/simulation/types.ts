
import {Simulator} from "./simulator.js"
import {FeedHelper} from "./feed-helper.js"
import {SpecificFeedback} from "../replication/types.js"
import {EntityId, ReplicatorId, State} from "../types.js"

export type Simulant<F> = {
	facts: F
	simulate: (immediate: SimulaImmediate<F>) => void
	dispose: () => void
}

export type SimulaPack = {
	id: EntityId
	simulator: Simulator
}

export type SimulaImmediate<F> = {
	feed: FeedHelper<F>
	feedback: [ReplicatorId, SpecificFeedback][]
}

export type Simulan<F> = (pack: SimulaPack) => Simulant<F>

export type Simula<A extends any[], F> = (...a: A) => Simulan<F>
export type Simulas = Record<string, Simula<any, any>>
export const simula = <F>() => <S extends Simula<any, F>>(s: S) => s
export const asSimulas = <S extends Simulas>(s: S) => s

export type Simulon<F> = {
	state: State<F>
	simulant: Simulant<F>
	feed: FeedHelper<F>
}

export type Feed = {
	created: [EntityId, State][]
	updated: [EntityId, any][]
	broadcasted: [EntityId, any][]
	destroyed: EntityId[]
}

