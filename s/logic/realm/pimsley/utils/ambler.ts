
import {Degrees, Scalar, Vec2} from "@benev/toolbox"

import {AmbleState} from "../types.js"
import {AnimTimeline} from "./anim-timeline.js"
import {constants} from "../../../../constants.js"
import {PimsleyAnims} from "./choose-pimsley-anims.js"
import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

const {crusader} = constants

export class Ambler {
	smoothedVelocity = new Vec2(0, 0)
	smoothedSpin = new Scalar(0)
	smoothedRotationDiscrepancy = new Scalar(0)

	headSwivel = 0.5
	timeline = new AnimTimeline()
	idleTimeline = new AnimTimeline()

	constructor(public anims: PimsleyAnims) {
		this.idleTimeline.setSpeed(anims.blended.idle)
	}

	animate(state: AmbleState) {
		const {seconds, grace} = state

		const movement = this.smoothedVelocity.approach(
			state.movement,
			grace.legworkSharpness,
			seconds,
		)

		const velocity = movement.magnitude()

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

		const speedBase = Scalar.remap(
			velocity,
			crusader.movement.walkSpeed, crusader.movement.sprintSpeed,
			(crusader.movement.walkSpeed * crusader.anim.walkSpeedRatio),
			(crusader.movement.walkSpeed * crusader.anim.sprintSpeedRatio),
			true,
		)
		const strafeSpeedBuff = 1 + (crusader.anim.strafeSpeedIncrease * strafeyness)
		const speed = speedBase * strafeSpeedBuff

		this.timeline.setSpeed(this.anims.blended.forward, speed)
		this.timeline.update()
		this.idleTimeline.update()

		this.smoothedRotationDiscrepancy.approach(state.rotationDiscrepancy, 15, seconds)
		const padding = 0.1

		this.headSwivel = Scalar.remap(
			this.smoothedRotationDiscrepancy.x,
			-Degrees.toRadians(90 * (1 - padding)),
			Degrees.toRadians(90 * (1 - padding)),
			padding, 1 - padding,
			true,
		)

		const weight = (x: number, max: number) => Scalar.clamp(
			Scalar.remap(x, 0, max, 0, 1, true),
		)

		this.anims.blended.forward.capacity = weight(forwards, crusader.movement.sprintSpeed)
		this.anims.blended.backward.capacity = weight(backwards, crusader.movement.sprintSpeed)
		this.anims.blended.leftward.capacity = weight(leftwards, crusader.movement.walkSpeed)
		this.anims.blended.rightward.capacity = weight(rightwards, crusader.movement.walkSpeed)
		this.anims.blended.turnLeft.capacity = weight(turnLeft, crusader.movement.walkSpeed)
		this.anims.blended.turnRight.capacity = weight(turnRight, crusader.movement.walkSpeed)
	}
}

