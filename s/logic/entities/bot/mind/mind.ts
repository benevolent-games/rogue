
import {Randy, Vec2} from "@benev/toolbox"
import {Agency} from "./agency.js"
import {Psychology} from "./psychology.js"
import {Perception} from "./perception.js"
import {Mentality, Wandering} from "./mentality.js"
import {BipedActivity, BipedState} from "../../../commons/biped/types.js"

/** the mind of a bot */
export class Mind {
	perception = new Perception()
	agency = new Agency()
	psychology: Psychology
	mentality: Mentality

	constructor(public randy: Randy) {
		this.psychology = Psychology.generate(randy)
		this.mentality = new Wandering(this)
	}

	behave(state: BipedState): BipedActivity {
		this.perception.self.coordinates.set_(...state.coordinates)
		this.mentality.think()
		return {
			block: this.agency.block ? 1 : 0,
			attack: this.agency.attack,
			sprint: this.agency.sprint,
			rotation: 0,
			movementIntent: new Vec2(0, 1),
		}
	}
}

