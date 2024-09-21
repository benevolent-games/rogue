
import {interval} from "@benev/slate"
import {Simulator} from "../simulation/simulator.js"
import {FeedbackDatas, FeedbackMemos, Feedbacks, Netconnection} from "./types.js"

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

