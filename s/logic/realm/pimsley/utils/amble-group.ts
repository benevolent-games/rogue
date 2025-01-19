
import {Scalar, Vec2} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {splitAxis} from "../../../../supercontrol/grip/utils/split-axis.js"

const min = 0.001

export class AmbleGroup {
	smoothed = new Vec2(0, 0)

	constructor(
			public idle: AnimationGroup,
			public forwards: AnimationGroup,
			public backwards: AnimationGroup,
			public leftwards: AnimationGroup,
			public rightwards: AnimationGroup,
		) {

		// TODO temp hack
		forwards.to = 40
		console.log(idle.to)
		idle.to = 39 * 2

		idle.weight = min
		forwards.weight = min
		backwards.weight = min
		leftwards.weight = min
		rightwards.weight = min

		const sync = forwards.animatables[0]!
		backwards.syncAllAnimationsWith(sync)
		leftwards.syncAllAnimationsWith(sync)
		rightwards.syncAllAnimationsWith(sync)

		idle.play(true)
		forwards.play(true)
		backwards.play(true)
		leftwards.play(true)
		rightwards.play(true)
	}

	setWeightsByVector(original: Vec2) {
		const vector = this.smoothed.lerp(original, 0.1)

		const magnitude = vector.magnitude()
		const [backwards, forwards] = splitAxis(vector.y)
		const [leftwards, rightwards] = splitAxis(vector.x)

		const activity = Scalar.clamp(
			Scalar.remap(magnitude, 0, 4, 0, 1),
			min,
		)

		const speed = Scalar.clamp(
			Scalar.remap(magnitude, 0, 4, 0.3, 1),
			min,
		)

		const weight = (x: number) => Scalar.clamp(
			Scalar.remap(x, 0, 4, 0, 1),
			min,
		)

		this.forwards.speedRatio = speed

		this.idle.weight = Scalar.clamp(1 - activity, min)
		this.forwards.weight = weight(forwards)
		this.backwards.weight = weight(backwards)
		this.leftwards.weight = weight(leftwards)
		this.rightwards.weight = weight(rightwards)
	}
}

