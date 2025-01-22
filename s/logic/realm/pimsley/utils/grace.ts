
import {Scalar} from "@benev/toolbox"
import {constants} from "../../../../constants.js"

const {crusader} = constants

export type Grace = {
	turnCap: number
	turnSharpness: number
	legworkSharpness: number
}

export class GraceTracker {
	factor = new Scalar(0)
	update(currentSpeed: number, seconds: number): Grace {
		const {movement, grace} = crusader
		const targetFactor = Scalar.remap(currentSpeed, movement.speed, movement.speedSprint, 0, 1, true)
		const factor = this.factor.approach(targetFactor, grace.adaptation, seconds).x
		return {
			turnCap: Scalar.lerp(grace.turnCap.x, grace.turnCap.y, factor),
			turnSharpness: Scalar.lerp(grace.turnSharpness.x, grace.turnSharpness.y, factor),
			legworkSharpness: Scalar.lerp(grace.legworkSharpness.x, grace.legworkSharpness.y, factor),
		}
	}
}

