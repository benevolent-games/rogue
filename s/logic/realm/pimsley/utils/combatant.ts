
import {Scalar} from "@benev/toolbox"
import {PimsleyAnim} from "./pimsley-anim.js"
import {PimsleyAnimState} from "../types.js"

export class Combatant {
	#attack = false
	#attackPrevious = false
	#attackBlend = 0

	#blockBlend = 0

	constructor(public anims: {
		attack: PimsleyAnim,
		block: PimsleyAnim,
	}) {}

	animate(state: PimsleyAnimState) {
		this.#animateAttacks(state)
		this.#animateBlocking(state)
	}

	#animateAttacks(state: PimsleyAnimState) {
		this.#attackPrevious = this.#attack
		this.#attack = !!state.attack
		const change = this.#attack !== this.#attackPrevious

		if (change && this.#attack)
			this.anims.attack.execute(a => a.reset())

		this.#attackBlend = Scalar.approach(
			this.#attackBlend,
			this.#attack ? 1 : 0,
			10,
			state.seconds
		)

		this.anims.attack.capacity = this.#attackBlend
	}

	#animateBlocking(state: PimsleyAnimState) {
		this.#blockBlend = Scalar.approach(
			this.#blockBlend,
			state.block,
			10,
			state.seconds,
		)
		this.anims.block.capacity = this.#blockBlend
	}
}

