
import {Map2} from "@benev/slate"

import {Replicas, Replon} from "./types.js"
import {ReplicatorId, State} from "../types.js"
import {Feed, Snapshot} from "../relay/types.js"
import {FeedbackCollector, FeedbackHelper} from "../relay/feedback-collector.js"

export class Replicator<Re> {
	ping = 100
	collector = new FeedbackCollector()

	#replons = new Map2<number, Replon>
	#feedbackHelpers: WeakMap<Replon, FeedbackHelper<any>> = new WeakMap()

	constructor(
		public realm: Re,
		public replicas: Replicas,
		public id: ReplicatorId,
	) {}

	applySnapshot(snapshot: Snapshot) {
		const entityStates = new Map(snapshot)

		// create or update entities
		for (const [id, state] of entityStates) {
			const replon = this.#replons.get(id)
			if (replon) replon.state.facts = state.facts
			else this.#create(id, state)
		}

		// delete obsolete entities
		for (const [id, replon] of this.#replons) {
			if (!entityStates.has(id))
				this.#destroy(id, replon)
		}
	}

	#create(id: number, state: State) {
		const replica = this.replicas[state.kind]
		const replicant = replica({id, realm: this.realm, replicator: this, facts: state.facts})
		const feedback = new FeedbackHelper(id, this.collector)
		const replon: Replon = {state, replicant}
		this.#replons.set(id, replon)
		this.#feedbackHelpers.set(replon, feedback)
	}

	#destroy(id: number, replon?: Replon) {
		if (replon)
			replon.replicant.dispose()
		this.#replons.delete(id)
	}

	replicate(feed: Feed) {
		for (const [id, state] of feed.creates) {
			this.#create(id, state)
		}

		for (const [id, facts] of feed.facts) {
			const replon = this.#replons.get(id)
			if (replon)
				replon.state.facts = facts
		}

		for (const [id, replon] of this.#replons) {
			const feedbackHelper = this.#feedbackHelpers.get(replon)!
			replon.replicant.replicate({
				feedback: feedbackHelper,
				feed: {
					facts: replon.state.facts,
					broadcasts: feed.broadcasts
						.filter(([recipient]) => recipient === id)
						.map(([,broadcast]) => broadcast),
				},
			})
		}

		for (const id of feed.destroys) {
			const replon = this.#replons.get(id)
			this.#destroy(id, replon)
		}
	}
}

