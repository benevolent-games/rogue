
import {RunningAverage} from "@benev/toolbox"

export type ParcelId = number
export type ParcelTime = number
export type Parcel<P> = [ParcelId, ParcelTime, P]

export class Bucket<T> {
	#items: T[] = []

	/** put an item in the bucket */
	give(item: T) {
		this.#items.push(item)
	}

	/** extract all items out of the bucket */
	take() {
		const items = this.#items
		this.#items = []
		return items
	}
}

/** outbox parcelizes messages, preparing them for the inbox's buffering */
export class Outbox<P> {
	#id = 0
	#start: number
	#bucket: Parcel<P>[] = []

	constructor(private now = () => Date.now()) {
		this.#start = now()
	}

	/** parcelize a payload (wrap it into a parcel) */
	wrap(payload: P): Parcel<P> {
		const id = this.#id++
		const time = this.now() - this.#start
		return [id, time, payload]
	}

	/** parcelize and wrap a payload into this outbox */
	give(payload: P) {
		this.#bucket.push(this.wrap(payload))
	}

	/** extract all parcels from this outbox */
	take() {
		const parcels = this.#bucket
		this.#bucket = []
		return parcels
	}
}

/** inbox delays messages with a buffer time, and actively corrects for network packet jitter */
export class Inbox<P> {
	#start: number
	#offsets: RunningAverage
	#buffer = new Map<ParcelId, Parcel<P>>
	#nanny = new Nanny()

	constructor(
			public delay = 25,
			public smoothing = 5,
			private now = () => Date.now(),
		) {
		this.#start = now()
		this.#offsets = new RunningAverage(smoothing)
	}

	/** put a parcel into this inbox */
	give(parcel: Parcel<P>) {
		const [id, time] = parcel
		if (this.#buffer.has(id)) return
		this.#buffer.set(id, parcel)
		this.#offsets.add(this.#offset(time))
	}

	/** extract all *available* parcels from this inbox */
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

