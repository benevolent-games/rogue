
import {interval} from "@benev/slate"
import {FeedCollector} from "./feed-collector.js"
import {Replicator} from "../replication/replicator.js"
import {FeedbackDatas, FeedbackMemos, FeedEvents, FeedFacts} from "./types.js"

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

