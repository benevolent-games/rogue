
import {Scalar} from "@benev/toolbox"
import {PimsleyAnim} from "./pimsley-anim.js"

export class Combatant {
	#attackBlend = 0
	#attack: Attack | null = null

	constructor(public anims: {
		attack: PimsleyAnim,
	}) {}

	animate(state: {
			attack: boolean,
			block: boolean,
			seconds: number,
		}) {

		if (state.attack && !this.#attack) {
			this.anims.attack.execute(a => a.reset())
			this.#attack = new Attack(this.anims.attack.durationSeconds)
		}

		if (this.#attack && this.#attack.isExpired()) {
			this.#attack = null
		}

		this.#attackBlend = Scalar.approach(this.#attackBlend, this.#attack ? 1 : 0, 10, state.seconds)
		this.anims.attack.capacity = this.#attackBlend
	}
}

export class Attack {
	expiresAt: number

	constructor(public durationSeconds: number) {
		this.expiresAt = Date.now() + (this.durationSeconds * 1000)
	}

	isExpired() {
		return Date.now() >= this.expiresAt
	}
}

