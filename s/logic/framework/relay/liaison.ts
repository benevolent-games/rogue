
import {interval} from "@benev/slate"
import {Message} from "./messages.js"
import {Feed, Feedback} from "./types.js"
import {Pingponger} from "./pingponger.js"
import {Communicator} from "./communicator.js"
import {FeedCollector} from "./feed-collector.js"
import {disposers} from "../../../tools/disposers.js"
import {Inbox, Outbox, Parcel} from "./inbox-outbox.js"
import {FeedbackCollector} from "./feedback-collector.js"

export class Liaison {
	pingponger: Pingponger

	inbox = new Inbox<Message>()
	outbox = new Outbox<Message>()

	feedCollector = new FeedCollector()
	feedbackCollector = new FeedbackCollector()

	dispose: () => void

	constructor(public communicator: Communicator<Parcel<Message>>) {
		this.pingponger = new Pingponger(
			p => communicator.sendUnreliable(this.outbox.wrap(p))
		)
		this.dispose = disposers(
			interval(1_000, () => this.pingponger.ping()),
			communicator.receiveReliable(m => this.inbox.give(m)),
			communicator.receiveUnreliable(m => this.inbox.give(m)),
		)
	}

	sendFeed(feed: Feed) {
		this.communicator.sendReliable(
			this.outbox.wrap(["feed", {
				creates: feed.creates,
				destroys: feed.destroys,
				broadcasts: feed.broadcasts,
			}]),
		)
		this.communicator.sendUnreliable(
			this.outbox.wrap(["feed", {
				facts: feed.facts,
			}]),
		)
	}

	sendFeedback(feedback: Feedback) {
		this.communicator.sendReliable(
			this.outbox.wrap(["feedback", {
				memos: feedback.memos,
			}]),
		)
		this.communicator.sendUnreliable(
			this.outbox.wrap(["feedback", {
				datas: feedback.datas,
			}]),
		)
	}

	take() {
		const {feedCollector, feedbackCollector} = this
		for (const message of this.inbox.take()) {
			const [kind, payload] = message
			switch (kind) {
				case "ping":
				case "pong":
					this.pingponger.receive(message)
					break

				case "feed":
					feedCollector.give(payload)
					break

				case "feedback":
					feedbackCollector.give(payload)
					break
			}
		}

		return {
			feed: feedCollector.take(),
			feedback: feedCollector.take(),
		}
	}
}

