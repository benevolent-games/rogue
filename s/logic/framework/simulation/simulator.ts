
import {Scribe} from "./scribe.js"
import {Map2} from "../../../tools/map2.js"
import {FeedHelper} from "./feed-helper.js"
import {ReplicatorId, State} from "../types.js"
import {IdCounter} from "../../../tools/id-counter.js"
import {SimulaPack, Simulas, Simulon} from "./types.js"
import {Feedback, SpecificFeedback} from "../replication/types.js"

export class Simulator<St, S extends Simulas<St> = any> {
	#simulons = new Map2<number, Simulon<any>>
	#idCounter = new IdCounter()
	#scribe = new Scribe()

	constructor(public station: St, public simulas: S) {}

	create<K extends keyof S>(kind: K, ...a: Parameters<S[K]>) {
		const id = this.#idCounter.next()
		const pack: SimulaPack<St> = {id, station: this.station, simulator: this}
		const simulant = this.simulas[kind](...a)(pack)
		const state: State<any> = {kind: kind as string, facts: simulant.facts}
		const feed = new FeedHelper(id, this.#scribe, simulant.facts)
		this.#simulons.set(id, {state, simulant, feed})
		this.#scribe.created.push([id, state])
		return simulant as ReturnType<ReturnType<S[K]>>
	}

	get(id: number) {
		this.#simulons.get(id)
	}

	require(id: number) {
		this.#simulons.require(id)
	}

	update(id: number, state: any) {
		this.#scribe.updated.push([id, state])
	}

	destroy(id: number) {
		this.#scribe.destroyed.push(id)
	}

	simulate(feedback: Feedback) {
		for (const [id, {simulant, feed}] of this.#simulons) {
			const fb: [ReplicatorId, SpecificFeedback<any>][] = []

			for (const [replicatorId, feeds] of feedback) {
				for (const [entityId, specific] of feeds)
					if (entityId === id)
						fb.push([replicatorId, specific])
			}

			simulant.simulate({
				feed,
				feedback: fb,
			})
		}
		return this.#scribe.extract()
	}
}

