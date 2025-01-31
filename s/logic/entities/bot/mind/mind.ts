
import {Randy} from "@benev/toolbox"

import {Chronex} from "./parts/chronex.js"
import {Mentality} from "./parts/mentality.js"
import {Perception} from "./parts/perception.js"
import {Personality} from "./parts/personality.js"
import {Wandering} from "./mentalities/wandering.js"
import {BipedActivity, BipedState} from "../../../commons/biped/types.js"

/** the mind of a bot */
export class Mind {
	perception = new Perception()

	chronex: Chronex
	personality: Personality
	mentality: Mentality

	constructor(public id: number) {
		const randy = new Randy(id)
		this.chronex = new Chronex(id, randy)
		this.personality = Personality.generate(randy)
		this.mentality = new Wandering(this)
	}

	behave(tick: number, state: BipedState): BipedActivity {
		this.#updatePerceptions(state)
		this.chronex.update(tick)
		return this.mentality.think()
	}

	#updatePerceptions(state: BipedState) {
		this.perception.self.coordinates.set_(...state.coordinates)
	}
}

