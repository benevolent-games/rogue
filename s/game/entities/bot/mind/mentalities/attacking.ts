
import {Mind} from "../mind.js"
import {Percept} from "../parts/perception.js"
import {Mentality} from "../parts/mentality.js"

/** attacking a target */
export class Attacking extends Mentality {
	constructor(mind: Mind, public target: Percept) {
		super(mind)
	}

	think() {
		return Mentality.blankActivity()
	}
}

