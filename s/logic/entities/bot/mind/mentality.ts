
import {Vec2} from "@benev/toolbox"
import {Mind} from "./mind.js"
import {Agency} from "./agency.js"
import {Percept} from "./perception.js"

/** current mental state of the bot */
export abstract class Mentality {
	constructor(public mind: Mind) {
		this.init()
	}
	init() {}
	abstract think(): void
}

/** totally randomly walking around */
export class Wandering extends Mentality {
	tick = 0

	init() {
		this.mind.agency = new Agency()
	}

	think() {
		const tick = this.tick++
		const rethink = (tick % 60) === 0
		if (!rethink)
			return undefined

		const {agency} = this.mind
		agency.pace = 1
		agency.ambulationGoal = this.#getRandomPointNearby()
		agency.lookingAt = this.#getRandomPointNearby()
	}

	#getRandomPointNearby() {
		const {randy, perception} = this.mind
		const offset = new Vec2(
			randy.range(-10, 10),
			randy.range(-10, 10),
		)
		return perception.self.coordinates.clone().add(offset)
	}
}

/** patrolling around looking for trouble */
export class Patrolling extends Mentality {
	think() {}
}

/** attacking a target */
export class Attacking extends Mentality {
	constructor(mind: Mind, public target: Percept) {
		super(mind)
	}

	think() {}
}

/** fleeing from a danger */
export class Fleeing extends Mentality {
	constructor(mind: Mind, public danger: Percept) {
		super(mind)
	}

	think() {}
}

