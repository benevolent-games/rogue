
import {Map2} from "@benev/slate"

export class Chronicle<T> {
	#map = new Map2<number, T>()

	get latest() {
		let tick: number | null = null
		for (const t of this.#map.keys())
			tick = (tick === null)
				? t
				: (t > tick)
					? t
					: tick
		return (tick === null)
			? undefined
			: this.#map.get(tick)
	}

	get oldest() {
		let tick: number | null = null
		for (const t of this.#map.keys())
			tick = (tick === null)
				? t
				: (t < tick)
					? t
					: tick
		return (tick === null)
			? undefined
			: this.#map.get(tick)
	}

	constructor(public memory: number) {}

	save(tick: number, item: T) {
		this.#map.set(tick, item)
		this.#cullTicksOlderThan(tick - this.memory)
	}

	load(tick: number) {
		return this.#map.get(tick)
	}

	#cullTicksOlderThan(eldest: number) {
		const obsolete = [...this.#map.keys()].filter(t => t < eldest)
		for (const old of obsolete)
			this.#map.delete(old)
	}
}

