
import {ReplicatorId} from "../types.js"
import {Feed} from "../simulation/types.js"
import {Map2} from "../../../tools/map2.js"
import {FeedbackHelper} from "./feedback-helper.js"
import {Replicas, ReplicatorFeedback, Replon} from "./types.js"

export class Replicator<Re> {
	#replons = new Map2<number, Replon>
	#feedbackHelpers: WeakMap<Replon, FeedbackHelper<any>> = new WeakMap()

	constructor(public realm: Re, public replicas: Replicas, public id: ReplicatorId) {}

	replicate(feed: Feed): ReplicatorFeedback {
		for (const [id, state] of feed.created) {
			const replica = this.replicas[state.kind]
			const feedback = new FeedbackHelper()
			const replicant = replica({id, realm: this.realm, replicator: this})
			const replon: Replon = {state, replicant}
			this.#replons.set(id, replon)
			this.#feedbackHelpers.set(replon, feedback)
		}

		for (const [id, facts] of feed.updated) {
			const replon = this.#replons.require(id)
			replon.state.facts = facts
		}

		for (const id of feed.destroyed) {
			const replon = this.#replons.require(id)
			replon.replicant.dispose()
			this.#replons.delete(id)
		}

		const feedback: ReplicatorFeedback = []

		for (const [id, replon] of this.#replons) {
			const feedbackHelper = this.#feedbackHelpers.get(replon)!
			replon.replicant.replicate({
				feedback: feedbackHelper,
				feed: {
					facts: replon.state.facts,
					broadcasts: feed.broadcasted
						.filter(([recipient]) => recipient === id)
						.map(([,broadcast]) => broadcast),
				},
			})
			const fb = feedbackHelper.extract()
			const hasData = fb.data !== undefined && fb.data !== null
			const hasMemos = fb.memos.length > 0
			if (hasData || hasMemos)
				feedback.push([id, fb])
		}

		return feedback
	}
}

