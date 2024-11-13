
import {Message} from "./messages.js"
import {Pingponger} from "./pingponger.js"
import {Feedbacks, Netconnection} from "./types.js"
import {Simulator} from "../simulation/simulator.js"
import {bountiful} from "../../../tools/bountiful.js"

export class Nethost {
	pingponger: Pingponger
	#connections = new Set<Netconnection>()

	constructor(public simulator: Simulator<any, any>) {
		this.pingponger = new Pingponger({
			send: pingpong => this.#sendToAll(["pingpong", pingpong], {reliable: false}),
		})
	}

	acceptConnection(connection: Netconnection) {
		this.#connections.add(connection)
		return {
			disconnect: () => { this.#connections.delete(connection) },
			receive: (message: Message) => this.receive(message, connection),
		}
	}

	takeAllFeedbacks() {
		const feedbacks: Feedbacks = []
		for (const connection of this.#connections) {
			const feedback = connection.feedbackCollector.take()
			feedbacks.push([connection.replicatorId, feedback])
		}
		return feedbacks
	}

	send() {
		const feed = this.simulator.collector.take()
		const {facts, creates, broadcasts, destroys} = feed

		if (!bountiful(facts, creates, broadcasts, destroys))
			return

		for (const connection of this.#connections) {
			if (bountiful(facts))
				connection.sendReliable(["feed", {facts}])
			if (bountiful(creates, broadcasts, destroys))
				connection.sendUnreliable(["feed", {creates, broadcasts, destroys}])
		}
	}

	receive([kind, payload]: Message, connection: Netconnection) {
		switch (kind) {
			case "feedback":
				return this.#handleFeedback(payload, connection)

			case "pingpong":
				return this.pingponger.receive(payload)

			default:
				throw new Error(`nethost cannot process message of kind "${kind}"`)
		}
	}

	#sendToAll(message: Message, {reliable}: {reliable: boolean}) {
		for (const connection of this.#connections) {
			if (reliable) connection.sendReliable(message)
			else connection.sendUnreliable(message)
		}
	}

	#handleFeedback(feedback: {datas?: any[], memos?: any[]}, connection: Netconnection) {
		const {datas = [], memos = []} = feedback
		connection.feedbackCollector.give({datas, memos})
	}
}

