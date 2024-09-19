
import {Vec2} from "@benev/toolbox"
import {GameTact} from "./make-tact.js"
import {cardinals} from "../../../tools/directions.js"

export function getMovement(tact: GameTact) {
	const {buttons} = tact.inputs.basic
	const vec = Vec2.zero()

	const directions = [
		!!buttons.moveNorth.input.down,
		!!buttons.moveEast.input.down,
		!!buttons.moveSouth.input.down,
		!!buttons.moveWest.input.down,
	]

	directions.forEach((pressed, index) => {
		if (pressed)
			vec.addV(cardinals.at(index)!)
	})

	return vec.normalize()
}

