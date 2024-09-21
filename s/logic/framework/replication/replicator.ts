
import {ReplicatorId} from "../types.js"
import {Map2} from "../../../tools/map2.js"
import {Replicas, Replon} from "./types.js"
import {Feed} from "../relay/feed-collector.js"
import {FeedbackCollector, FeedbackHelper} from "../relay/feedback-collector.js"

export class Replicator<Re> {
	collector = new FeedbackCollector()
	#replons = new Map2<number, Replon>
	#feedbackHelpers: WeakMap<Replon, FeedbackHelper<any>> = new WeakMap()

	constructor(public realm: Re, public replicas: Replicas, public id: ReplicatorId) {}

	replicate(feed: Feed) {
		for (const [id, state] of feed.creates) {
			const replica = this.replicas[state.kind]
			const replicant = replica({id, realm: this.realm, replicator: this})
			const feedback = new FeedbackHelper(id, this.collector)
			const replon: Replon = {state, replicant}
			this.#replons.set(id, replon)
			this.#feedbackHelpers.set(replon, feedback)
		}

		for (const [id, facts] of feed.facts) {
			const replon = this.#replons.require(id)
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
			const replon = this.#replons.require(id)
			replon.replicant.dispose()
			this.#replons.delete(id)
		}
	}
}

