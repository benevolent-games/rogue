
import {Vec2} from "@benev/toolbox"
import {Mind} from "../mind.js"
import {BipedActivity} from "../../../../commons/biped/types.js"

/** current mental state of the bot */
export abstract class Mentality {
	static blankActivity(): BipedActivity {
		return {
			block: 0,
			rotation: 0,
			attack: false,
			sprint: false,
			movementIntent: Vec2.zero(),
		}
	}

	#lastPhase = 0

	constructor(public mind: Mind) {
		this.#lastPhase = mind.chronex.phase
	}

	abstract think(): BipedActivity

	isNewPhase() {
		const currentPhase = this.mind.chronex.phase
		const lastPhase = this.#lastPhase
		this.#lastPhase = currentPhase
		return currentPhase !== lastPhase
	}
}

