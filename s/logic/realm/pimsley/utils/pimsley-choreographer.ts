
import {Ambler} from "./ambler.js"
import {Combatant} from "./combatant.js"
import {PimsleyAnimState} from "../types.js"
import {PimsleyAnim} from "./pimsley-anim.js"
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
			anims.block.upper,
			new BucketShare([
				anims.forward.upper,
				anims.backward.upper,
				anims.leftward.upper,
				anims.rightward.upper,
			]),
			anims.turnLeft.upper,
			anims.turnRight.upper,
			anims.idle.upper,
		])

		const lowerStack = new BucketStack([
			new BucketShare([
				anims.forward.lower,
				anims.backward.lower,
				anims.leftward.lower,
				anims.rightward.lower,
			]),
			anims.turnLeft.lower,
			anims.turnRight.lower,
			anims.attack.lower,
			anims.block.lower,
			anims.idle.lower,
		])

		anims.idle.capacity = 1
		anims.attack.capacity = 0
		anims.block.capacity = 0
		anims.forward.capacity = 0
		anims.backward.capacity = 0
		anims.leftward.capacity = 0
		anims.rightward.capacity = 0
		anims.turnLeft.capacity = 0
		anims.turnRight.capacity = 0

		const setup = (p: PimsleyAnim) => p.execute(a => {
			a.play(true)
		})

		setup(anims.idle)
		setup(anims.attack)
		setup(anims.block)
		setup(anims.forward)
		setup(anims.backward)
		setup(anims.leftward)
		setup(anims.rightward)
		setup(anims.turnLeft)
		setup(anims.turnRight)

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

