
import {Circular} from "@benev/toolbox"

export class Anglemeter {
	#angle: Circular
	#previous: Circular
	#velocity = 0

	constructor(angle: Circular) {
		this.#angle = angle
		this.#previous = angle.clone()
	}

	measure(deltaTime: number) {
		const difference = this.#angle.difference(this.#previous)
		this.#previous = this.#angle.clone()
		this.#velocity = difference / deltaTime
		return this.#velocity
	}

	/** radians per second */
	get velocity() {
		return this.#velocity
	}
}

