
import {Randy, Vec2} from "@benev/toolbox"

export class Vecset2<V extends Vec2 = Vec2> {
	#map = new Map<string, V>()

	static toKey(vector: Vec2): string {
		return `${vector.x},${vector.y}`
	}

	constructor(vectors: V[] = []) {
		for (const v of vectors)
			this.add(v)
	}

	static dedupe<V extends Vec2>(vectors: V[]) {
		return new this(vectors).list()
	}

	get size() {
		return this.#map.size
	}

	get(vector: V) {
		return this.#map.get(Vecset2.toKey(vector))
	}

	has(vector: V) {
		return this.#map.has(Vecset2.toKey(vector))
	}

	add(...vectors: V[]) {
		for (const vector of vectors) {
			const key = Vecset2.toKey(vector)
			if (!this.#map.has(key))
				this.#map.set(key, vector)
		}
	}

	delete(...vectors: V[]) {
		for (const vector of vectors) {
			this.#map.delete(Vecset2.toKey(vector))
		}
	}

	list() {
		return Array.from(this.#map.values())
	}

	values() {
		return this.#map.values()
	}

	yoink(randy: Randy) {
		return randy.yoink(this.list())
	}
}

