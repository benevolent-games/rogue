
import {Vec2} from "@benev/toolbox"
import {constants} from "../../../../constants.js"

export class Speedometer {
	#previous: Vec2
	#velocity = Vec2.zero()

	constructor(place: Vec2) {
		this.#previous = place.clone()
	}

	update(place: Vec2) {
		const difference = place.clone().subtract(this.#previous)
		this.#previous = place.clone()
		this.#velocity = difference.multiplyBy(constants.sim.tickRate)
		return this.#velocity
	}

	/** measured velocity in meters-per-second */
	get velocity() {
		return this.#velocity
	}
}

