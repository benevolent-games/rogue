
import {Vec2} from "@benev/toolbox"

export class Vecset2 {
	#vectors: Vec2[] = []

	get size() {
		return this.#vectors.length
	}

	has(vec: Vec2) {
		return this.#vectors.some(v => v.equals(vec))
	}

	add(vec: Vec2) {
		if (!this.has(vec))
			this.#vectors.push(vec)
	}

	delete(vec: Vec2) {
		this.#vectors = this.#vectors.filter(v => !v.equals(vec))
	}

	list() {
		return [...this.#vectors]
	}
}

