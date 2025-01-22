
import {Scalar, Vec2} from "@benev/toolbox"

import {AmbleState} from "../types.js"
import {constants} from "../../../../constants.js"
import {BabylonAnimBucket} from "../../../../tools/buckets/babylon-anim.js"
import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

const {crusader} = constants

export class Ambler {
	smoothedVelocity = new Vec2(0, 0)
	smoothedAngularVelocity = new Scalar(0)

	constructor(public anims: {
			idle: BabylonAnimBucket,
			forward: BabylonAnimBucket,
			backward: BabylonAnimBucket,
			leftward: BabylonAnimBucket,
			rightward: BabylonAnimBucket,
		}) {

		anims.idle.capacity = 1
		anims.forward.capacity = 1
		anims.backward.capacity = 1
		anims.leftward.capacity = 1
		anims.rightward.capacity = 1

		anims.idle.animationGroup.play(true)
		anims.forward.animationGroup.play(true)
		anims.backward.animationGroup.play(true)
		anims.leftward.animationGroup.play(true)
		anims.rightward.animationGroup.play(true)

		const sync = anims.forward.animationGroup.animatables[0]!
		anims.backward.animationGroup.syncAllAnimationsWith(sync)
		anims.leftward.animationGroup.syncAllAnimationsWith(sync)
		anims.rightward.animationGroup.syncAllAnimationsWith(sync)
	}

	animate(state: AmbleState) {
		const {seconds} = state

		const movement = this.smoothedVelocity.approach(state.movement, crusader.anim.legworkSharpness, seconds)
		const [backwards, forwards] = splitAxis(movement.y)
		const [leftwards, rightwards] = splitAxis(movement.x)

		const strafeyness = Scalar.clamp(
			Scalar.remap(
				Math.abs(movement.x),
				0, crusader.movement.speed,
				0, 1,
				true,
			)
		)

		const weight = (x: number) => Scalar.clamp(
			Scalar.remap(x, 0, crusader.movement.speedSprint, 0, 1, true),
		)

		this.anims.forward.animationGroup.speedRatio = crusader.anim.speedMultiplier * (
			1 + (crusader.anim.strafeSpeedIncrease * strafeyness)
		)

		this.anims.forward.capacity = weight(forwards)
		this.anims.backward.capacity = weight(backwards)
		this.anims.leftward.capacity = weight(leftwards)
		this.anims.rightward.capacity = weight(rightwards)

		// this.anims.idle.weight = new Scalar(0)
		// 	.add(
		// 		this.anims.forward.weight,
		// 		this.anims.backward.weight,
		// 		this.anims.leftward.weight,
		// 		this.anims.rightward.weight,
		// 	)
		// 	.inverse()
		// 	.clamp()
		// 	.x
	}
}

