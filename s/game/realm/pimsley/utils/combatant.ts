
import {linear, Scalar} from "@benev/toolbox"
import {PimsleyAnimState} from "../types.js"
import {AnimTimeline} from "./anim-timeline.js"
import {PimsleyAnims} from "./choose-pimsley-anims.js"

export class Combatant {
	#blockBlend = 0
	#playingAttackAnim = false

	timeline = new AnimTimeline()

	constructor(public anims: PimsleyAnims) {
		this.timeline.setSpeed(anims.blended.attack)
	}

	animate(state: PimsleyAnimState) {
		this.#animateAttacks(state)
		this.#animateBlocking(state)
	}

	#animateAttacks(state: PimsleyAnimState) {
		this.timeline.update()

		if ((state.attack && !this.#playingAttackAnim)) {
			this.#playingAttackAnim = true
			this.timeline.playhead = 0

			this.timeline.wait.then(() => {
				this.#playingAttackAnim = false
			})
		}

		const attackBlend = this.#playingAttackAnim
			? linear(this.timeline.playhead, [
				[0, 0],
				[0.3, 1],
				[0.7, 1],
				[1, 0],
			])
			: 0

		this.anims.blended.attack.capacity = attackBlend
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

