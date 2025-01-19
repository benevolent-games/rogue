
import {constants} from "../../../../constants.js"
import {Circular} from "../../../../tools/temp/circular.js"

export class Anglemeter {
	#previous: number
	#velocity = 0

	constructor(angle: number) {
		this.#previous = angle
	}

	update(angle: number) {
		const difference = Circular.distance(angle, this.#previous)
		this.#previous = Circular.normalize(angle)
		this.#velocity = difference * constants.sim.tickRate
		return this.#velocity
	}

	/** measured velocity in radians-per-second */
	get velocity() {
		return this.#velocity
	}
}

