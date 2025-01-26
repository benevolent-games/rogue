
import {Scalar} from "@benev/toolbox"
import {PimsleyAnimState} from "../types.js"
import {PimsleyAnims} from "./choose-pimsley-anims.js"

export class Combatant {
	#attack = false
	#attackPrevious = false
	#attackBlend = 0

	#blockBlend = 0

	constructor(public anims: PimsleyAnims) {}

	animate(state: PimsleyAnimState) {
		this.#animateAttacks(state)
		this.#animateBlocking(state)
	}

	#animateAttacks(state: PimsleyAnimState) {
		this.#attackPrevious = this.#attack
		this.#attack = !!state.attack
		const change = this.#attack !== this.#attackPrevious

		if (change && this.#attack)
			this.anims.blended.attack.execute(a => a.reset())

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

