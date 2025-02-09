
import {Mind} from "../mind.js"
import {Percept} from "../parts/perception.js"
import {Mentality} from "../parts/mentality.js"

/** fleeing from a danger */
export class Fleeing extends Mentality {
	constructor(mind: Mind, public danger: Percept) {
		super(mind)
	}

	think() {
		return Mentality.blankActivity()
	}
}

