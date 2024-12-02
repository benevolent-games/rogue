
import {Randy, Vec2} from "@benev/toolbox"

export class Vecset2<V extends Vec2 = Vec2> {
	#vectors: V[] = []

	constructor(vectors: V[] = []) {
		for (const v of vectors)
			this.add(v)
	}

	static dedupe<V extends Vec2>(vectors: V[]) {
		return new this(vectors).list()
	}

	get size() {
		return this.#vectors.length
	}

	has(vec: V) {
		return this.#vectors.some(v => v.equals(vec))
	}

	add(...vecs: V[]) {
		for (const vec of vecs) {
			if (!this.has(vec))
				this.#vectors.push(vec)
		}
	}

	delete(...vecs: V[]) {
		this.#vectors = this.#vectors.filter(a => !vecs.some(b => b.equals(a)))
	}

	list() {
		return [...this.#vectors]
	}

	yoink(randy: Randy) {
		return randy.yoink(this.#vectors)
	}
}

