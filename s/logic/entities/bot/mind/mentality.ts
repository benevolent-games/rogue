
import {Randy, Vec2} from "@benev/toolbox"
import {Mind} from "./mind.js"
import {Agency} from "./agency.js"
import {Percept} from "./perception.js"

/** current mental state of the bot */
export abstract class Mentality {
	constructor(public mind: Mind) {
		this.init()
	}

	init() {}

	abstract think(tick: number): void
}

/** totally randomly walking around */
export class Wandering extends Mentality {
	init() {
		this.mind.agency = new Agency()
	}

	think(tick: number) {
		const {id, agency} = this.mind
		const phase = id + Math.floor(((id * 10) + tick) / 60)
		this.mind.randy = new Randy(phase)
		agency.pace = 1
		agency.ambulationGoal = new Vec2(0, 1)
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
	think(tick: number) {}
}

/** attacking a target */
export class Attacking extends Mentality {
	constructor(mind: Mind, public target: Percept) {
		super(mind)
	}

	think(tick: number) {}
}

/** fleeing from a danger */
export class Fleeing extends Mentality {
	constructor(mind: Mind, public danger: Percept) {
		super(mind)
	}

	think(tick: number) {}
}

