
import {deep, Map2} from "@benev/slate"

import {Feedbacks, Snapshot} from "../relay/types.js"
import {IdCounter} from "../../../tools/id-counter.js"
import {FeedCollector, FeedHelper} from "../relay/feed-collector.js"
import {Data, EntityId, Memo, ReplicatorId, State} from "../types.js"
import {ProvidedEntityFeedback, SimulaPack, Simulas, Simulon} from "./types.js"

export class Simulator<St, S extends Simulas<St> = any> {
	collector = new FeedCollector()
	#counter = new IdCounter()
	#simulons = new Map2<number, Simulon<any>>

	constructor(
		public station: St,
		public simulas: S,
	) {}

	create<K extends keyof S>(kind: K, ...a: Parameters<S[K]>) {
		const id = this.#counter.next()
		const pack: SimulaPack<St> = {id, station: this.station, simulator: this}
		const simulant = this.simulas[kind](...a)(pack)
		const state: State<any> = {kind: kind as string, facts: simulant.facts}
		const feed = new FeedHelper(id, this.collector, state)
		this.#simulons.set(id, {state, simulant, feed})
		this.collector.setCreate(id, state)
		return simulant as ReturnType<ReturnType<S[K]>>
	}

	get(id: number) {
		this.#simulons.get(id)
	}

	require(id: number) {
		this.#simulons.require(id)
	}

	destroy(id: number) {
		const simulon = this.#simulons.require(id)
		simulon.simulant.dispose()
		this.#simulons.delete(id)
		this.collector.setDestroy(id)
	}

	snapshot(): Snapshot {
		return [...this.#simulons].map(
			([id, simulon]) => [id, simulon.state]
		)
	}

	simulate(feedbacks: Feedbacks) {
		for (const [id, {simulant, feed}] of this.#simulons) {
			simulant.simulate({
				feed,
				feedback: this.#prepareFeedbackForEntity(id, feedbacks),
			})
		}
	}

	#prepareFeedbackForEntity(entityId: EntityId, feedbacks: Feedbacks): ProvidedEntityFeedback<any> {
		const memos: [ReplicatorId, Memo][] = []
		const datas: [ReplicatorId, Data][] = []

		for (const [replicatorId, feedback] of feedbacks) {
			for (const [eid, memo] of feedback.memos)
				if (eid === entityId)
					memos.push([replicatorId, memo])

			for (const [eid, data] of feedback.datas)
				if (eid === entityId)
					datas.push([replicatorId, data])
		}

		return {memos, datas}
	}
}

