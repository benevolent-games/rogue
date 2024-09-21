
import {Simulator} from "./simulator.js"
import {FeedHelper} from "./feed-helper.js"
import {Archetype, EntityId, FeedEvent, ReplicatorId, State} from "../types.js"

export type Simulant<Ar extends Archetype> = {
	facts: Ar["facts"]
	simulate: (immediate: SimulaImmediate<Ar>) => void
	dispose: () => void
}

export type SimulaPack<St> = {
	id: EntityId
	station: St
	simulator: Simulator<St>
}

export type SimulaImmediate<Ar extends Archetype> = {
	feed: FeedHelper<Ar>
	feedback: ProvidedEntityFeedback<Ar>
}

export type ProvidedEntityFeedback<Ar extends Archetype> = {
	datas: [ReplicatorId, Ar["data"]][]
	memos: [ReplicatorId, Ar["memo"]][]
}

export type Simulan<St, Ar extends Archetype> = (pack: SimulaPack<St>) => Simulant<Ar>

export type Simula<St, A extends any[], Ar extends Archetype> = (...a: A) => Simulan<St, Ar>
export type Simulas<St> = Record<string, Simula<St, any, any>>
export const simula = <St>() => <Ar extends Archetype>() => <S extends Simula<St, any, Ar>>(s: S) => s
export const asSimulas = <St, S extends Simulas<St>>(s: S) => s

export type Simulon<Ar extends Archetype> = {
	state: State<Ar>
	simulant: Simulant<Ar>
	feed: FeedHelper<Ar>
}

export type RecordFeedEventFn = (event: FeedEvent.Any) => void

