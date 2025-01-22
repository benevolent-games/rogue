
import {Scalar, Vec2} from "@benev/toolbox"

import {AmbleState} from "../types.js"
import {PimsleyAnim} from "./pimsley-anim.js"
import {constants} from "../../../../constants.js"
import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

const {crusader} = constants

export class Ambler {
	smoothedVelocity = new Vec2(0, 0)
	smoothedAngularVelocity = new Scalar(0)

	constructor(public anims: {
		idle: PimsleyAnim,
		forward: PimsleyAnim,
		backward: PimsleyAnim,
		leftward: PimsleyAnim,
		rightward: PimsleyAnim,
	}) {}

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

		const speed = crusader.anim.speedMultiplier * (
			1 + (crusader.anim.strafeSpeedIncrease * strafeyness)
		)

		this.anims.forward.speedRatio = speed
		this.anims.backward.speedRatio = speed
		this.anims.leftward.speedRatio = speed
		this.anims.rightward.speedRatio = speed

		this.anims.forward.capacity = weight(forwards)
		this.anims.backward.capacity = weight(backwards)
		this.anims.leftward.capacity = weight(leftwards)
		this.anims.rightward.capacity = weight(rightwards)
	}
}

