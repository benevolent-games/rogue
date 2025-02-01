
import {Ambler} from "./ambler.js"
import {Combatant} from "./combatant.js"
import {BipedAnim} from "./biped-anim.js"
import {PimsleyAnimState} from "../types.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {Changer} from "../../../../supercontrol/grip/parts/changer.js"
import {choosePimsleyAnims, PimsleyAnims} from "./choose-pimsley-anims.js"
import {BucketShare, BucketStack} from "../../../../tools/buckets/buckets.js"
import { Scalar } from "@benev/toolbox"

export class PimsleyChoreographer {
	priority = 0
	anims: PimsleyAnims

	#ambler: Ambler
	#combatant: Combatant
	#highPriority = new Changer(true)
	#stacks: {upper: BucketStack, lower: BucketStack}

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

	freeze() {}
	unfreeze() {}

	animate(state: PimsleyAnimState) {
		this.#ambler.animate(state)
		this.#combatant.animate(state)

		this.#stacks.upper.cycle(1)
		this.#stacks.lower.cycle(1)

		this.#highPriority.value = this.priority < 2

		const fn = (anim: BipedAnim, timeline = this.#ambler.timeline) => {
			anim.goToFraction(timeline.playhead, true)
		}

		const schedule: [BipedAnim, () => void][] = []

		const consider = (anim: BipedAnim, timeline = this.#ambler.timeline) => {
			schedule.push([anim, () => fn(anim, timeline)])
		}

		this.anims.blended.idle.goToFraction(this.#ambler.timeline.playhead, false)

		consider(this.anims.blended.forward)
		consider(this.anims.blended.backward)
		consider(this.anims.blended.leftward)
		consider(this.anims.blended.rightward)
		consider(this.anims.blended.turnLeft)
		consider(this.anims.blended.turnRight)
		consider(this.anims.blended.attack, this.#combatant.timeline)
		consider(this.anims.blended.block)

		schedule.sort(([a], [b]) => b.capacity - a.capacity)

		const actual = (this.#highPriority.value)
			? schedule
			: schedule.slice(0, 3)

		const {idle} = this.anims.blended
		const idleScheduled = [idle, () => fn(idle)] as [BipedAnim, () => void]
		const seriously = [idleScheduled, ...actual]

		// upper
		{
			const waterSum = seriously.reduce((s, [anim]) => s + anim.upper.water, 0)
			const remaining = Scalar.clamp(1 - waterSum)
			if (remaining > 0) {
				idle.upper.water = Scalar.clamp(idle.upper.water + remaining)
			}
			// const waterSum2 = seriously.reduce((s, [anim]) => s + anim.upper.water, 0)
			// console.log("fix!", waterSum2.toFixed(2), remaining)
		}

		// lower
		{
			const waterSum = seriously.reduce((s, [anim]) => s + anim.lower.water, 0)
			const remaining = Scalar.clamp(1 - waterSum)
			if (remaining > 0) {
				idle.lower.water = Scalar.clamp(idle.lower.water + remaining)
			}
		}

		for (const [,fn] of seriously)
			fn()

		if (this.#highPriority.value)
			this.anims.additive.headSwivel.goto(this.#ambler.headSwivel, true)
		else if (this.#highPriority.changed)
			this.anims.additive.headSwivel.goto(0.5, true)
	}
}

