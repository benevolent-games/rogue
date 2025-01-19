
import {Scalar, Vec2} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {constants} from "../../../../constants.js"
import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

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

	animate(tick: number, rawVelocity: Vec2, _rawAngularVelocity: number) {
		const vector = this.smoothedVelocity.lerp(rawVelocity, 0.2)
		// const angularVelocity = this.smoothedAngularVelocity.lerp(rawAngularVelocity, 0.2).x

		const {crusader} = constants
		const magnitude = vector.magnitude()
		const [backwards, forwards] = splitAxis(vector.y)
		const [leftwards, rightwards] = splitAxis(vector.x)

		const activity = Scalar.clamp(
			Scalar.remap(magnitude, 0, crusader.speedSprint, 0, 1)
		)

		const strafeyness = Scalar.clamp(
			Scalar.remap(
				Math.abs(vector.x),
				0, crusader.speed,
				0, 1,
			)
		)

		const speed = Scalar.clamp(
			Scalar.remap(magnitude, 0, crusader.speedSprint, 0.5, 1.5)
		)

		const weight = (x: number) => Scalar.clamp(
			Scalar.remap(x, 0, crusader.speedSprint, 0, 1),
			min,
		)

		this.forwards.speedRatio = speed + (0.2 * strafeyness)

		this.idle.weight = Scalar.clamp(1 - activity, min)
		this.forwards.weight = weight(forwards)
		this.backwards.weight = weight(backwards)
		this.leftwards.weight = weight(leftwards * 2)
		this.rightwards.weight = weight(rightwards * 2)
	}
}

