
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
	randy: Randy
	psychology: Psychology
	mentality: Mentality

	constructor(public id: number) {
		this.randy = new Randy(id)
		this.psychology = Psychology.generate(this.randy)
		this.mentality = new Wandering(this)
	}

	behave(tick: number, state: BipedState): BipedActivity {
		this.perception.self.coordinates.set_(...state.coordinates)

		this.mentality.think(tick)

		const movementIntent = this.agency.ambulationGoal
			? this.agency.ambulationGoal.clone()
				.subtract(this.perception.self.coordinates)
				.clampMagnitude(1)
			: Vec2.zero()

		return {
			rotation: 0,
			movementIntent,
			block: this.agency.block ? 1 : 0,
			attack: this.agency.attack,
			sprint: this.agency.sprint,
		}
	}
}

