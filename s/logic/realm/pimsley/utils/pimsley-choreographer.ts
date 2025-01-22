
import {Ambler} from "./ambler.js"
import {Combatant} from "./combatant.js"
import {PimsleyAnimState} from "../types.js"
import {choosePimsleyAnims} from "./choose-pimsley-anims.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {BucketShare, BucketStack} from "../../../../tools/buckets/buckets.js"

export class PimsleyChoreographer {
	#ambler: Ambler
	#combatant: Combatant
	#actualizeAnimations: () => void

	constructor(pallet: Pallet) {
		const anims = choosePimsleyAnims(pallet)

		this.#ambler = new Ambler(anims)
		this.#combatant = new Combatant(anims)

		const upperStack = new BucketStack([
			anims.attack.upper,
			new BucketShare([
				anims.forward.upper,
				anims.backward.upper,
				anims.leftward.upper,
				anims.rightward.upper,
			]),
			anims.idle.upper,
		])

		const lowerStack = new BucketStack([
			new BucketShare([
				anims.forward.lower,
				anims.backward.lower,
				anims.leftward.lower,
				anims.rightward.lower,
			]),
			anims.attack.lower,
			anims.idle.lower,
		])

		anims.idle.capacity = 1
		anims.attack.capacity = 0
		anims.forward.capacity = 0
		anims.backward.capacity = 0
		anims.leftward.capacity = 0
		anims.rightward.capacity = 0

		anims.attack.execute(a => a.play(true))
		anims.forward.execute(a => a.play(true))
		anims.backward.execute(a => a.play(true))
		anims.leftward.execute(a => a.play(true))
		anims.rightward.execute(a => a.play(true))
		anims.idle.execute(a => a.play(true))

		this.#actualizeAnimations = () => {
			upperStack.dump()
			upperStack.fill(1)

			lowerStack.dump()
			lowerStack.fill(1)
		}

		this.#actualizeAnimations()
	}

	animate(state: PimsleyAnimState) {
		this.#ambler.animate(state)
		this.#combatant.animate(state)
		this.#actualizeAnimations()
	}
}

