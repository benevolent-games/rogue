
import {Scalar, Vec2} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {constants} from "../../../../constants.js"
import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

const {crusader} = constants
const min = 0.001

export class AmbleGroup {
	smoothedVelocity = new Vec2(0, 0)
	smoothedAngularVelocity = new Scalar(0)

	constructor(
			public idle: AnimationGroup,
			public forwards: AnimationGroup,
			public backwards: AnimationGroup,
			public leftwards: AnimationGroup,
			public rightwards: AnimationGroup,
		) {

		idle.weight = min
		forwards.weight = min
		backwards.weight = min
		leftwards.weight = min
		rightwards.weight = min

		idle.play(true)
		forwards.play(true)
		backwards.play(true)
		leftwards.play(true)
		rightwards.play(true)

		const sync = forwards.animatables[0]!
		backwards.syncAllAnimationsWith(sync)
		leftwards.syncAllAnimationsWith(sync)
		rightwards.syncAllAnimationsWith(sync)
	}

	animate(_tick: number, seconds: number, rawMovement: Vec2, _rawSpin: number) {
		const movement = this.smoothedVelocity.approach(rawMovement, crusader.anim.legworkSharpness, seconds)
		const [backwards, forwards] = splitAxis(movement.y)
		const [leftwards, rightwards] = splitAxis(movement.x)

		const strafeyness = Scalar.clamp(
			Scalar.remap(
				Math.abs(movement.x),
				0, crusader.movement.speed,
				0, 1,
			)
		)

		const weight = (x: number) => Scalar.clamp(
			Scalar.remap(x, 0, crusader.movement.speedSprint, 0, 1, true),
			min,
		)

		this.forwards.speedRatio = (1 + (0.2 * strafeyness)) * crusader.anim.speedMultiplier
		this.forwards.weight = weight(forwards)
		this.backwards.weight = weight(backwards)
		this.leftwards.weight = weight(leftwards)
		this.rightwards.weight = weight(rightwards)

		this.idle.weight = new Scalar(0)
			.add(
				this.forwards.weight,
				this.backwards.weight,
				this.leftwards.weight,
				this.rightwards.weight,
			)
			.clamp(min)
			.inverse()
			.x
	}
}

