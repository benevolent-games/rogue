
import {Randy, Vec2} from "@benev/toolbox"

export class Vecset2<V extends Vec2 = Vec2> {
	#map = new Map<string, V>()

	static toKey(vec: Vec2): string {
		return `${vec.x},${vec.y}`
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

	has(vec: V) {
		return this.#map.has(Vecset2.toKey(vec))
	}

	add(...vecs: V[]) {
		for (const vec of vecs) {
			const key = Vecset2.toKey(vec)
			if (!this.#map.has(key))
				this.#map.set(key, vec)
		}
	}

	delete(...vecs: V[]) {
		for (const vec of vecs) {
			this.#map.delete(Vecset2.toKey(vec))
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

