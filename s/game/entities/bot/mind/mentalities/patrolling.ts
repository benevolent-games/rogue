
import {Mentality} from "../parts/mentality.js"

/** patrolling around looking for trouble */
export class Patrolling extends Mentality {
	think() {
		return Mentality.blankActivity()
	}
}

