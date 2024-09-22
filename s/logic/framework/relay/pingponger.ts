
import {Ping, Pong} from "./messages.js"
import {Averager} from "../../../tools/averager.js"
import {IdCounter} from "../../../tools/id-counter.js"

type PingId = number
type Timestamp = number

export class Pingponger {
	#id = new IdCounter()
	#pending = new Map<PingId, Timestamp>()

	#rtt = 99
	#timeout = 3000
	#averager = new Averager(5)

	constructor(private options: {
		send: (p: Ping | Pong) => void
		onRtt?: (rtt: number) => void
	}) {}

	get latestRtt() {
		return this.#rtt
	}

	get averageRtt() {
		return this.#averager.average
	}

	ping() {
		const pingId = this.#id.next()
		const timestamp = Date.now()
		this.#pending.set(pingId, timestamp)
		this.options.send(["ping", pingId])
		this.#prune()
	}

	receive([kind, id]: Ping | Pong) {
		if (kind === "ping")
			this.options.send(["pong", id])
		else if (kind === "pong")
			this.#handlePong(id)
		else
			throw new Error(`Unknown pingpong message kind: ${kind}`)
	}

	#handlePong(pingId: number) {
		const timestamp = this.#pending.get(pingId)

		if (timestamp === undefined)
			return

		const now = Date.now()
		this.#rtt = now - timestamp
		this.#averager.add(this.#rtt)

		this.#pending.delete(pingId)
		this.options.onRtt?.(this.#rtt)
	}

	#prune() {
		const now = Date.now()
		for (const [pingId, timestamp] of this.#pending) {
			if ((now - timestamp) > this.#timeout)
				this.#pending.delete(pingId)
		}
	}
}

