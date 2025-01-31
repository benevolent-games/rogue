
import {Scalar} from "@benev/toolbox"
import {PimsleyAnimState} from "../types.js"
import {AnimTimeline} from "./anim-timeline.js"
import {PimsleyAnims} from "./choose-pimsley-anims.js"

export class Combatant {
	#attack = false
	#attackPrevious = false
	#attackBlend = 0

	#blockBlend = 0

	timeline = new AnimTimeline()

	constructor(public anims: PimsleyAnims) {
		this.timeline.setSpeed(anims.blended.attack)
	}

	animate(state: PimsleyAnimState) {
		this.#animateAttacks(state)
		this.#animateBlocking(state)
	}

	#animateAttacks(state: PimsleyAnimState) {
		this.timeline.update()

		this.#attackPrevious = this.#attack
		this.#attack = !!state.attack
		const change = this.#attack !== this.#attackPrevious

		if (change && this.#attack) {
			this.timeline.playhead = 0
		}

		this.#attackBlend = Scalar.approach(
			this.#attackBlend,
			this.#attack ? 1 : 0,
			10,
			state.seconds
		)

		this.anims.blended.attack.capacity = this.#attackBlend
	}

	#animateBlocking(state: PimsleyAnimState) {
		this.#blockBlend = Scalar.approach(
			this.#blockBlend,
			state.block,
			10,
			state.seconds,
		)
		this.anims.blended.block.capacity = this.#blockBlend
	}
}

