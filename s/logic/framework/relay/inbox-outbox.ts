
import {RunningAverage} from "@benev/toolbox"
import {LagFn, noLag} from "../../../tools/fake-lag.js"

export type ParcelId = number
export type ParcelTime = number
export type Parcel<P> = [ParcelId, ParcelTime, P]

export class Netpipe<P> {
	#inbox: Inbox<P>
	#outbox: Outbox<P>

	constructor(delay: number) {
		this.#inbox = new Inbox<P>(delay)
		this.#outbox = new Outbox<P>()
	}

	send = (payload: P, lag = noLag) => {
		const parcel = this.#outbox.wrap(payload)
		lag(() => this.#inbox.ingest(parcel))
	}

	take() {
		return this.#inbox.take()
	}
}

export class Instapipe<P> {
	payloads: P[] = []

	constructor(_ignored: number) {}

	send = (payload: P, _ignored?: LagFn) => {
		this.payloads.push(payload)
	}

	take() {
		const payloads = this.payloads
		this.payloads = []
		return payloads
	}
}

export class Outbox<P> {
	id = 0
	start: number

	constructor(private now = () => Date.now()) {
		this.start = now()
	}

	wrap(payload: P): Parcel<P> {
		const id = this.id++
		const time = this.now() - this.start
		return [id, time, payload]
	}
}

export class Inbox<P> {
	#start: number
	#offsets: RunningAverage
	#buffer = new Map<ParcelId, Parcel<P>>
	#nanny = new Nanny()

	constructor(
			public delay = 100,
			public smoothing = 20,
			private now = () => Date.now(),
		) {
		this.#start = now()
		this.#offsets = new RunningAverage(smoothing)
	}

	ingest(parcel: Parcel<P>) {
		const [id, time] = parcel
		if (this.#buffer.has(id)) return undefined
		this.#buffer.set(id, parcel)
		this.#offsets.add(this.#offset(time))
	}

	take(): P[] {
		const ready: Parcel<P>[] = []
		const localtime = this.#localtime

		for (const parcel of this.#buffer.values()) {
			const [id, time] = parcel

			const offset = this.#offset(time, localtime)
			const abberation = offset - this.#offsets.average
			const correctedTime = (time + offset) - abberation
			const since = localtime - correctedTime

			if (since >= this.delay) {
				ready.push(parcel)
				this.#buffer.delete(id)
			}
		}

		return ready
			.sort(sortById)
			.filter(this.#nanny.removeDisorderly)
			.map(getPayload)
	}

	get #localtime() {
		return this.now() - this.#start
	}

	#offset(time: number, localtime = this.#localtime) {
		return localtime - time
	}
}

class Nanny {
	biggest: number = -1

	removeDisorderly = ([id]: Parcel<any>) => {
		if (id <= this.biggest)
			return false
		this.biggest = id
		return true
	}
}

function getPayload<P>([,,payload]: Parcel<P>): P {
	return payload
}

function sortById([idA]: Parcel<any>, [idB]: Parcel<any>) {
	return idA - idB
}

