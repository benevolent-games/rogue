
import {Scalar} from "@benev/toolbox"
import {Ambler} from "./ambler.js"
import {Combatant} from "./combatant.js"
import {PimsleyAnimState} from "../types.js"
import {AnimTimeline} from "./anim-timeline.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {Changer} from "../../../../packs/grip/parts/changer.js"
import {choosePimsleyAnims, PimsleyAnims} from "./choose-pimsley-anims.js"
import {BabylonAnimBucket} from "../../../../tools/buckets/babylon-anim.js"
import {BucketShare, BucketStack} from "../../../../tools/buckets/buckets.js"

export class PimsleyChoreographer {
	priority = 0
	anims: PimsleyAnims

	#upperSchedule: AnimScheduler
	#lowerSchedule: AnimScheduler

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

		this.#upperSchedule = new AnimScheduler(new ScheduledAnim(this.anims.blended.idle.upper, this.#ambler.idleTimeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.attack.upper, this.#combatant.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.block.upper, this.#ambler.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.forward.upper, this.#ambler.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.backward.upper, this.#ambler.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.leftward.upper, this.#ambler.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.rightward.upper, this.#ambler.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.turnLeft.upper, this.#ambler.timeline))
		this.#upperSchedule.add(new ScheduledAnim(this.anims.blended.turnRight.upper, this.#ambler.timeline))

		this.#lowerSchedule = new AnimScheduler(new ScheduledAnim(this.anims.blended.idle.lower, this.#ambler.idleTimeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.attack.lower, this.#combatant.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.block.lower, this.#ambler.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.forward.lower, this.#ambler.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.backward.lower, this.#ambler.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.leftward.lower, this.#ambler.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.rightward.lower, this.#ambler.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.turnLeft.lower, this.#ambler.timeline))
		this.#lowerSchedule.add(new ScheduledAnim(this.anims.blended.turnRight.lower, this.#ambler.timeline))
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

		this.#highPriority.value = this.priority < 3

		const limit = this.#highPriority.value
			? 8
			: 2

		this.anims.blended.idle.goToFraction(this.#ambler.timeline.playhead, false)
		this.#upperSchedule.execute(limit)
		this.#lowerSchedule.execute(limit)

		if (this.#highPriority.value)
			this.anims.additive.headSwivel.goto(this.#ambler.headSwivel, true)
		else if (this.#highPriority.changed)
			this.anims.additive.headSwivel.goto(0.5, true)
	}
}

class ScheduledAnim {
	constructor(
		public anim: BabylonAnimBucket,
		public timeline: AnimTimeline,
	) {}
}

class AnimScheduler {
	schedule: ScheduledAnim[] = []
	constructor(public fallback: ScheduledAnim) {}

	add(anim: ScheduledAnim) {
		this.schedule.push(anim)
	}

	execute(limit: number): ScheduledAnim[] {
		const sorted = this.schedule.toSorted((a, b) => b.anim.water - a.anim.water)
		const selected = [this.fallback, ...sorted.slice(0, limit)]
		const waterSum = selected.reduce((s, a) => s + a.anim.water, 0)
		const remaining = Scalar.clamp(1 - waterSum)
		this.fallback.anim.fill(remaining)

		for (const {anim, timeline} of selected)
			anim.goToFraction(timeline.playhead, true)

		return selected
	}
}

