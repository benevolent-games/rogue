
import {Vec2} from "@benev/toolbox"

export class Speedometer {
	#vector: Vec2
	#previous: Vec2
	#velocity = Vec2.zero()

	constructor(vector: Vec2) {
		this.#vector = vector
		this.#previous = vector.clone()
	}

	measure(deltaTime: number) {
		const difference = this.#vector.clone().subtract(this.#previous)
		this.#previous = this.#vector.clone()
		this.#velocity = difference.divideBy(deltaTime)
		return this.#velocity
	}

	/** meters per second */
	get velocity() {
		return this.#velocity
	}
}

