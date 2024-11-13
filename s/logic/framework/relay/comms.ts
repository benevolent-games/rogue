
import {Map2} from "@benev/slate"

import {Feed, Feedback, Feedbacks, Senders} from "./types.js"
import {Inbox, Outbox} from "./inbox-outbox.js"
import {IdCounter} from "../../../tools/id-counter.js"
import {FeedbackCollector} from "./feedback-collector.js"
import {FeedbackMessage} from "./messages.js"
import {FeedCollector} from "./feed-collector.js"
import {bountiful} from "../../../tools/bountiful.js"

export class HostComms {
	#replicatorIds = new IdCounter()
	#liaisons = new Set<Liaison>()

	makeLiaison(senders: Senders) {
		const replicatorId = this.#replicatorIds.next()
		const liaison = new Liaison(replicatorId, senders)
		this.#liaisons.add(liaison)
		return liaison
	}

	deleteLiaison(liaison: Liaison) {
		this.#liaisons.delete(liaison)
	}

	collectAllFeedbacks() {
		const feedbacks: Feedbacks = []
		for (const liaison of this.#liaisons) {

			// aggregating inbox feedback
			for (const feedback of liaison.inbox.take())
				liaison.feedbackCollector.give(feedback)

			// organizing feedback by replicator id
			const feedback = liaison.feedbackCollector.take()
			feedbacks.push([liaison.replicatorId, feedback])
		}

		return feedbacks
	}

	broadcast(feed: Feed) {
		const {facts, creates, broadcasts, destroys} = feed

		if (!bountiful(facts, creates, broadcasts, destroys))
			return

		for (const liaison of this.#liaisons) {
			if (bountiful(facts))
				liaison.senders.sendReliable(["feed", {facts}])
			if (bountiful(creates, broadcasts, destroys))
				liaison.senders.sendUnreliable(["feed", {creates, broadcasts, destroys}])
		}
	}
}

export class Liaison {
	outbox = new Outbox<Feed>()
	inbox = new Inbox<Feedback>()
	feedbackCollector = new FeedbackCollector()
	constructor(public replicatorId: number, public senders: Senders) {}
}

export class ClientComms {
	inbox = new Inbox<Feed>()
	outbox = new Outbox<FeedbackMessage>()
	feedCollector = new FeedCollector()
}

