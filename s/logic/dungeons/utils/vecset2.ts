
import {Randy, Vec2} from "@benev/toolbox"

export class Vecset2 {
	#vectors: Vec2[] = []

	constructor(vectors: Vec2[] = []) {
		for (const v of vectors)
			this.add(v)
	}

	static dedupe(vectors: Vec2[]) {
		return new this(vectors).list()
	}

	get size() {
		return this.#vectors.length
	}

	has(vec: Vec2) {
		return this.#vectors.some(v => v.equals(vec))
	}

	add(...vecs: Vec2[]) {
		for (const vec of vecs) {
			if (!this.has(vec))
				this.#vectors.push(vec)
		}
	}

	delete(vec: Vec2) {
		this.#vectors = this.#vectors.filter(v => !v.equals(vec))
	}

	list() {
		return [...this.#vectors]
	}

	yoink(randy: Randy) {
		return randy.yoink(this.#vectors)
	}
}

