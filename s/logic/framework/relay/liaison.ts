
import {interval} from "@benev/slate"

import {GameMessage} from "./messages.js"
import {Feed, Feedback} from "./types.js"
import {Pingponger} from "./pingponger.js"
import {Fiber} from "../../../tools/fiber.js"
import {FeedCollector} from "./feed-collector.js"
import {bountiful} from "../../../tools/bountiful.js"
import {disposers} from "../../../tools/disposers.js"
import {Inbox, Outbox, Parcel} from "./inbox-outbox.js"
import {FeedbackCollector} from "./feedback-collector.js"
import {fakeLag, LagFn, LagProfile} from "../../../tools/fake-lag.js"

export class Liaison {
	pingponger: Pingponger
	pingPeriod = 1_000

	inbox = new Inbox<GameMessage>()
	outbox = new Outbox<GameMessage>()

	feedCollector = new FeedCollector()
	feedbackCollector = new FeedbackCollector()

	lag: LagFn
	lagLossless: LagFn

	dispose: () => void

	constructor(
			public fiber: Fiber<Parcel<GameMessage>>,
			lag: LagProfile | null = null,
		) {

		this.lag = fakeLag(lag)
		this.lagLossless = fakeLag(lag ? {...lag, loss: 0} : null)

		this.pingponger = new Pingponger(p => {
			const parcel = this.outbox.wrap(p)
			this.lag(() => fiber.unreliable.send(parcel))
		})

		this.dispose = disposers(
			interval(this.pingPeriod, () => this.pingponger.ping()),
			fiber.reliable.recv.on(m => this.inbox.give(m)),
			fiber.unreliable.recv.on(m => this.inbox.give(m)),
		)
	}

	sendFeed({creates, destroys, broadcasts, facts}: Feed) {
		if (bountiful(creates, destroys, broadcasts)) {
			const parcel = this.outbox.wrap(["feed", {creates, destroys, broadcasts}])
			this.lagLossless(() => this.fiber.reliable.send(parcel))
		}
		if (bountiful(facts)) {
			const parcel = this.outbox.wrap(["feed", {facts}])
			this.lag(() => this.fiber.unreliable.send(parcel))
		}
	}

	sendFeedback({memos, datas}: Feedback) {
		if (bountiful(memos)) {
			const parcel = this.outbox.wrap(["feedback", {memos}])
			this.lagLossless(() => this.fiber.reliable.send(parcel))
		}
		if (bountiful(datas)) {
			const parcel = this.outbox.wrap(["feedback", {datas}])
			this.lag(() => this.fiber.unreliable.send(parcel))
		}
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

				default:
					console.warn(`unknown message kind "${kind}"`)
			}
		}

		return {
			feed: feedCollector.take(),
			feedback: feedbackCollector.take(),
		}
	}
}

