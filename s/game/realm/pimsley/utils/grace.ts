
import {Scalar} from "@benev/toolbox"
import {constants} from "../../../../constants.js"

const {crusader} = constants
const {movement, grace} = crusader

export type Grace = {
	turnCap: number
	turnSharpness: number
	legworkSharpness: number
}

export class GraceTracker {
	factor = new Scalar(0)

	update(currentSpeed: number, seconds: number): Grace {
		const targetFactor = Scalar.remap(currentSpeed, movement.walkSpeed, movement.sprintSpeed, 0, 1, true)
		const factor = this.factor.approach(targetFactor, grace.adaptation, seconds).x
		return {
			turnCap: Scalar.lerp(grace.walk.turnCap, grace.sprint.turnCap, factor),
			turnSharpness: Scalar.lerp(grace.walk.turnSharpness, grace.sprint.turnSharpness, factor),
			legworkSharpness: Scalar.lerp(grace.walk.legworkSharpness, grace.sprint.legworkSharpness, factor),
		}
	}
}

