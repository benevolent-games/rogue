
import {Ambler} from "./ambler.js"
import {Combatant} from "./combatant.js"
import {PimsleyAnimState} from "../types.js"
import {AnimSynchronizer} from "./anim-synchronizer.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {choosePimsleyAnims, PimsleyAnims} from "./choose-pimsley-anims.js"
import {BucketShare, BucketStack} from "../../../../tools/buckets/buckets.js"

export class PimsleyChoreographer {
	anims: PimsleyAnims
	#ambler: Ambler
	#combatant: Combatant
	#synchronizer: AnimSynchronizer
	#stacks: {upper: BucketStack, lower: BucketStack}

	constructor(pallet: Pallet) {
		this.anims = choosePimsleyAnims(pallet)
		this.#stacks = this.#organizeStacks(this.anims)
		this.#ambler = new Ambler(this.anims)
		this.#combatant = new Combatant(this.anims)

		this.#synchronizer = new AnimSynchronizer(
			pallet.container.scene,
			[
				this.anims.blended.forward,
				this.anims.blended.backward,
				this.anims.blended.leftward,
				this.anims.blended.rightward,
				this.anims.blended.turnLeft,
				this.anims.blended.turnRight,
			].flatMap(a => [a.upper.animationGroup, a.lower.animationGroup])
		)

		this.anims.blended.idle.capacity = 1
		this.anims.blended.attack.capacity = 0
		this.anims.blended.block.capacity = 0
		this.anims.blended.forward.capacity = 0
		this.anims.blended.backward.capacity = 0
		this.anims.blended.leftward.capacity = 0
		this.anims.blended.rightward.capacity = 0
		this.anims.blended.turnLeft.capacity = 0
		this.anims.blended.turnRight.capacity = 0

		this.anims.additive.headSwivel.animationGroup.weight = 1
		this.anims.additive.headSwivel.animationGroup.speedRatio = 1
		this.anims.additive.headSwivel.goto(0.5)
	}

	#organizeStacks({blended}: PimsleyAnims) {
		const upper = new BucketStack([
			blended.attack.upper,
			blended.block.upper,
			new BucketShare([
				blended.forward.upper,
				blended.backward.upper,
				blended.leftward.upper,
				blended.rightward.upper,
			]),
			blended.turnLeft.upper,
			blended.turnRight.upper,
			blended.idle.upper,
		])

		const lower = new BucketStack([
			new BucketShare([
				blended.forward.lower,
				blended.backward.lower,
				blended.leftward.lower,
				blended.rightward.lower,
			]),
			blended.turnLeft.lower,
			blended.turnRight.lower,
			blended.attack.lower,
			blended.block.lower,
			blended.idle.lower,
		])

		return {lower, upper}
	}

	freeze() {
		for (const anim of Object.values(this.anims.blended))
			anim.execute(a => a.stop())
		for (const anim of Object.values(this.anims.additive))
			anim.animationGroup.stop()
	}

	unfreeze() {
		for (const anim of Object.values(this.anims.blended))
			anim.execute(a => a.play(true))
		for (const anim of Object.values(this.anims.additive))
			anim.animationGroup.play(true)
	}

	animate(state: PimsleyAnimState) {
		this.#ambler.animate(state)
		this.#combatant.animate(state)

		this.#stacks.upper.dump()
		this.#stacks.upper.fill(1)

		this.#stacks.lower.dump()
		this.#stacks.lower.fill(1)

		this.#synchronizer.synchronize()
	}
}

