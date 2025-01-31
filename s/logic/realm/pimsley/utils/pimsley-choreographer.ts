
import {Ambler} from "./ambler.js"
import {Combatant} from "./combatant.js"
import {BipedAnim} from "./biped-anim.js"
import {PimsleyAnimState} from "../types.js"
import {AnimTimeline} from "./anim-timeline.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {Changer} from "../../../../supercontrol/grip/parts/changer.js"
import {choosePimsleyAnims, PimsleyAnims} from "./choose-pimsley-anims.js"
import {BucketShare, BucketStack} from "../../../../tools/buckets/buckets.js"

export class PimsleyChoreographer {
	#timeline = new AnimTimeline()

	priority = 0
	anims: PimsleyAnims

	#ambler: Ambler
	#combatant: Combatant
	#stacks: {upper: BucketStack, lower: BucketStack}

	#highPriority = new Changer(true)

	constructor(pallet: Pallet) {
		this.anims = choosePimsleyAnims(pallet)
		this.#stacks = this.#organizeStacks(this.anims)
		this.#ambler = new Ambler(this.anims)
		this.#combatant = new Combatant(this.anims)

		this.anims.blended.idle.capacity = 1
		this.anims.blended.attack.capacity = 0
		this.anims.blended.block.capacity = 0
		this.anims.blended.forward.capacity = 0
		this.anims.blended.backward.capacity = 0
		this.anims.blended.leftward.capacity = 0
		this.anims.blended.rightward.capacity = 0
		this.anims.blended.turnLeft.capacity = 0
		this.anims.blended.turnRight.capacity = 0

		for (const anim of Object.values(this.anims.blended))
			anim.execute(a => {
				a.play(true)
				a.pause()
			})

		for (const anim of Object.values(this.anims.additive)) {
			anim.animationGroup.play(true)
			anim.animationGroup.pause()
		}

		this.anims.additive.headSwivel.animationGroup.weight = 1
		this.anims.additive.headSwivel.goto(0.5, true)
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
		// for (const anim of Object.values(this.anims.blended))
		// 	anim.execute(a => {
		// 		a.stop()
		// 	})
	}

	unfreeze() {
		// for (const anim of Object.values(this.anims.blended))
		// 	anim.execute(a => {
		// 		a.play(true)
		// 		a.pause()
		// 	})
	}

	tick = 0

	animate(state: PimsleyAnimState) {
		this.#ambler.animate(state)
		this.#combatant.animate(state)

		this.#stacks.upper.dump()
		this.#stacks.upper.fill(1)

		this.#stacks.lower.dump()
		this.#stacks.lower.fill(1)

		this.#highPriority.value = this.priority < 2

		const fn = (anim: BipedAnim) => {
			anim.goToFrame(this.#timeline.frame(anim), true)
		}

		fn(this.anims.blended.idle)
		fn(this.anims.blended.forward)
		fn(this.anims.blended.backward)
		fn(this.anims.blended.leftward)
		fn(this.anims.blended.rightward)
		fn(this.anims.blended.turnLeft)
		fn(this.anims.blended.turnRight)
		fn(this.anims.blended.attack)
		fn(this.anims.blended.block)

		if (this.#highPriority.value)
			this.anims.additive.headSwivel.goto(this.#ambler.headSwivel, true)
		else if (this.#highPriority.changed)
			this.anims.additive.headSwivel.goto(0.5, true)




		// this.anims.blended.idle.capacity = 1
		// this.anims.blended.idle.upper.fill(1)
		// this.anims.blended.idle.lower.fill(1)

		// fn(this.anims.blended.idle, false)








		// this.anims.blended.forward.goToFrame(this.#timeline.frame(this.anims.blended.forward), true)
		// this.anims.blended.leftward.goToFrame(this.#timeline.frame(this.anims.blended.leftward), true)
	}
}

