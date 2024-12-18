
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

export class Vecmap2<X> {
	#map = new Map2<string, X>()

	static toKey(vector: Vec2) {
		return `${vector.x},${vector.y}`
	}

	constructor(entries: [Vec2, X][] = []) {
		for (const [vector, x] of entries)
			this.set(vector, x)
	}

	get size() {
		return this.#map.size
	}

	get(vector: Vec2) {
		const key = Vecmap2.toKey(vector)
		return this.#map.get(key)
	}

	has(vector: Vec2) {
		const key = Vecmap2.toKey(vector)
		return this.#map.has(key)
	}

	set(vector: Vec2, x: X) {
		const key = Vecmap2.toKey(vector)
		this.#map.set(key, x)
		return this
	}

	delete(vector: Vec2) {
		const key = Vecmap2.toKey(vector)
		this.#map.delete(key)
	}

	entries() {
		return this.#map.entries()
	}

	keys() {
		return this.#map.keys()
	}

	values() {
		return this.#map.values()
	}
}

