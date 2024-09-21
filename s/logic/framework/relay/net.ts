
import {Feed, FeedCollector} from "./feed-collector.js"
import {Feedback, FeedbackCollector, Feedbacks} from "./feedback-collector.js"
import {Replicator} from "../replication/replicator.js"
import {interval} from "@benev/slate"
import {Simulator} from "../simulation/simulator.js"
import {ReplicatorId} from "../types.js"

export type FeedFacts = Feed["facts"]
export type FeedEvents = Pick<Feed, "creates" | "broadcasts" | "destroys">

export type FeedbackDatas = Feedback["datas"]
export type FeedbackMemos = Feedback["memos"]

export type Netconnection = {
	replicatorId: ReplicatorId
	feedbackCollector: FeedbackCollector
	sendFacts: (feedFacts: FeedFacts) => void
	sendEvents: (feedEvents: FeedEvents) => void
}

export class Nethost {
	#stop: () => void
	#connections = new Set<Netconnection>()

	constructor(
			public simulator: Simulator<any, any>,
			sendRateHz: number,
		) {
		this.#stop = interval.hz(sendRateHz, () => this.#update())
	}

	takeAllFeedbacks() {
		const feedbacks: Feedbacks = []
		for (const connection of this.#connections) {
			const feedback = connection.feedbackCollector.take()
			feedbacks.push([connection.replicatorId, feedback])
		}
		return feedbacks
	}

	#update() {
		const feed = this.simulator.collector.take()
		const {creates, broadcasts, destroys} = feed
		for (const connection of this.#connections) {
			connection.sendFacts(feed.facts)
			connection.sendEvents({creates, broadcasts, destroys})
		}
	}

	acceptConnection(connection: Netconnection) {
		this.#connections.add(connection)
		return {
			disconnect: () => {
				this.#connections.delete(connection)
			},
			receiveDatas: (datas: FeedbackDatas) => {
				connection.feedbackCollector.aggregate({datas, memos: []})
			},
			receiveMemos: (memos: FeedbackMemos) => {
				connection.feedbackCollector.aggregate({datas: [], memos})
			},
		}
	}

	dispose() {
		this.#stop()
	}
}

export class Netclient {
	#stop: () => void

	collector = new FeedCollector()

	constructor(options: {
			replicator: Replicator<any>
			sendRateHz: number
			sendDatas: (feedbackDatas: FeedbackDatas) => void
			sendMemos: (feedbackMemos: FeedbackMemos) => void
		}) {

		this.#stop = interval.hz(options.sendRateHz, () => {
			const {datas, memos} = options.replicator.collector.take()
			options.sendDatas(datas)
			options.sendMemos(memos)
		})
	}

	receiveFacts(feedFacts: FeedFacts) {
		for (const [entityId, facts] of feedFacts)
			this.collector.setFacts(entityId, facts)
	}

	receiveEvents(feedEvents: FeedEvents) {
		this.collector.aggregate({facts: [], ...feedEvents})
	}

	dispose() {
		this.#stop()
	}
}

export class SoloHub {
	nethost: Nethost
	netclient: Netclient

	constructor(
			public simulator: Simulator<any, any>,
			public replicator: Replicator<any>,
		) {

		this.nethost = new Nethost(simulator, 15)

		const handle = this.nethost.acceptConnection({
			replicatorId: replicator.id,
			feedbackCollector: new FeedbackCollector(),
			sendFacts: x => this.netclient.receiveFacts(x),
			sendEvents: x => this.netclient.receiveEvents(x),
		})

		this.netclient = new Netclient({
			replicator,
			sendRateHz: 15,
			sendDatas: x => handle.receiveDatas(x),
			sendMemos: x => handle.receiveMemos(x),
		})
	}

	dispose() {
		this.nethost.dispose()
		this.netclient.dispose()
	}
}

