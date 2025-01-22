
import {Scalar} from "@benev/toolbox"
import {PimsleyAnim} from "./pimsley-anim.js"

export class Combatant {
	#attack = false
	#attackPrevious = false
	#attackBlend = 0

	constructor(public anims: {
		attack: PimsleyAnim,
	}) {}

	animate(state: {
			attack: boolean,
			block: boolean,
			seconds: number,
		}) {

		this.#attackPrevious = this.#attack
		this.#attack = !!state.attack
		const change = this.#attack !== this.#attackPrevious

		if (change && this.#attack)
			this.anims.attack.execute(a => a.reset())

		this.#attackBlend = Scalar.approach(this.#attackBlend, this.#attack ? 1 : 0, 10, state.seconds)
		this.anims.attack.capacity = this.#attackBlend
	}
}

