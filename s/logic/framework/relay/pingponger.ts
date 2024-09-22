
import {Ping, Pong} from "./messages.js"
import {IdCounter} from "../../../tools/id-counter.js"

type PingId = number
type Timestamp = number

export class Pingponger {
	#rtt = 99
	#id = new IdCounter()
	#pending = new Map<PingId, Timestamp>()

	constructor(private options: {
		timeout: number
		send: (p: Ping | Pong) => void
		onRtt?: (rtt: number) => void
	}) {}

	get rtt() {
		return this.#rtt
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

		this.#pending.delete(pingId)
		this.options.onRtt?.(this.#rtt)
	}

	#prune() {
		const now = Date.now()
		for (const [pingId, timestamp] of this.#pending) {
			if ((now - timestamp) > this.options.timeout)
				this.#pending.delete(pingId)
		}
	}
}

