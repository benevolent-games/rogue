
import {Scalar, Vec2} from "@benev/toolbox"

import {AmbleState} from "../types.js"
import {PimsleyAnim} from "./pimsley-anim.js"
import {constants} from "../../../../constants.js"
import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

const {crusader} = constants

export class Ambler {
	smoothedVelocity = new Vec2(0, 0)
	smoothedSpin = new Scalar(0)

	constructor(public anims: {
		idle: PimsleyAnim,
		forward: PimsleyAnim,
		backward: PimsleyAnim,
		leftward: PimsleyAnim,
		rightward: PimsleyAnim,
		turnLeft: PimsleyAnim,
		turnRight: PimsleyAnim,
	}) {}

	animate(state: AmbleState) {
		const {seconds, grace} = state

		const movement = this.smoothedVelocity.approach(
			state.movement,
			grace.legworkSharpness,
			seconds,
		)

		this.smoothedSpin.approach(
			state.spin,
			grace.legworkSharpness,
			seconds,
		)

		const [backwards, forwards] = splitAxis(movement.y)
		const [leftwards, rightwards] = splitAxis(movement.x)
		const [turnLeft, turnRight] = splitAxis(this.smoothedSpin.x)

		const strafeyness = Scalar.clamp(
			Scalar.remap(
				Math.abs(movement.x),
				0, crusader.movement.walkSpeed,
				0, 1,
				true,
			)
		)

		const speed = (crusader.movement.walkSpeed * crusader.anim.speedMultiplier) * (
			1 + (crusader.anim.strafeSpeedIncrease * strafeyness)
		)

		this.anims.forward.speedRatio = speed
		this.anims.backward.speedRatio = speed
		this.anims.leftward.speedRatio = speed
		this.anims.rightward.speedRatio = speed
		this.anims.turnLeft.speedRatio = speed
		this.anims.turnRight.speedRatio = speed

		const weight = (x: number, max: number) => Scalar.clamp(
			Scalar.remap(x, 0, max, 0, 1, true),
		)

		this.anims.forward.capacity = weight(forwards, crusader.movement.sprintSpeed)
		this.anims.backward.capacity = weight(backwards, crusader.movement.sprintSpeed)
		this.anims.leftward.capacity = weight(leftwards, crusader.movement.walkSpeed)
		this.anims.rightward.capacity = weight(rightwards, crusader.movement.walkSpeed)
		this.anims.turnLeft.capacity = weight(turnLeft, crusader.movement.walkSpeed)
		this.anims.turnRight.capacity = weight(turnRight, crusader.movement.walkSpeed)
	}
}

