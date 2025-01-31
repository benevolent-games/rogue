
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

	constructor(public mind: Mind) {}

	abstract think(): BipedActivity
}

