
import {Map2} from "@benev/slate"

import {Liaison} from "./liaison.js"
import {GameMessage} from "./messages.js"
import {Parcel} from "./inbox-outbox.js"
import {Feed, Feedbacks} from "./types.js"
import {Fiber} from "../../../tools/fiber.js"
import {LagProfile} from "../../../tools/fake-lag.js"
import {IdCounter} from "../../../tools/id-counter.js"

export class Clientele {
	#replicatorIds = new IdCounter()
	#liaisons = new Map2<number, Liaison>()

	makeLiaison(fiber: Fiber<Parcel<GameMessage>>, lag: LagProfile | null = null) {
		const replicatorId = this.#replicatorIds.next()
		const liaison = new Liaison(fiber, lag)
		this.#liaisons.set(replicatorId, liaison)
		return {replicatorId, liaison}
	}

	deleteLiaison(replicatorId: number) {
		this.#liaisons.delete(replicatorId)
	}

	collectAllFeedbacks() {
		const feedbacks: Feedbacks = []
		for (const [replicatorId, liaison] of this.#liaisons) {
			const {feedback} = liaison.take()
			feedbacks.push([replicatorId, feedback])
		}
		return feedbacks
	}

	broadcastFeed(feed: Feed) {
		for (const liaison of this.#liaisons.values())
			liaison.sendFeed(feed)
	}
}

