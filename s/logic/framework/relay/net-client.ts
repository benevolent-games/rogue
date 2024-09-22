
import {Message} from "./messages.js"
import {Pingponger} from "./pingponger.js"
import {FeedCollector} from "./feed-collector.js"
import {Replicator} from "../replication/replicator.js"

export class Netclient {
	collector = new FeedCollector()
	pingponger: Pingponger

	constructor(private options: {
			replicator: Replicator<any>
			sendReliable: (message: Message) => void
			sendUnreliable: (message: Message) => void
		}) {

		this.pingponger = new Pingponger({
			send: pingpong => options.sendUnreliable(["pingpong", pingpong]),
			onRtt: () => options.replicator.ping = this.pingponger.averageRtt,
		})
	}

	send() {
		const {replicator, sendReliable, sendUnreliable} = this.options
		const {datas, memos} = replicator.collector.take()

		if (datas.length > 0)
			sendUnreliable(["feedback", {datas}])

		if (memos.length > 0)
			sendReliable(["feedback", {memos}])
	}

	receive([kind, payload]: Message) {
		switch (kind) {
			case "feed":
				return this.collector.aggregate({
					facts: payload.facts ?? [],
					creates: payload.creates ?? [],
					broadcasts: payload.broadcasts ?? [],
					destroys: payload.destroys ?? [],
				})

			case "pingpong":
				return this.pingponger.receive(payload)

			default:
				throw new Error(`netclient cannot accept message of kind "${kind}"`)
		}
	}
}

