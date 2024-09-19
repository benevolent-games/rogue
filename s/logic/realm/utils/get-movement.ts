
import {vec2} from "@benev/toolbox"
import {GameTact} from "./make-tact.js"
import {cardinals} from "../../../tools/directions.js"

export function getMovement(tact: GameTact) {
	const {buttons} = tact.inputs.basic
	let vec = vec2.zero()

	const directions = [
		!!buttons.moveNorth.input.down,
		!!buttons.moveEast.input.down,
		!!buttons.moveSouth.input.down,
		!!buttons.moveWest.input.down,
	]

	directions.forEach((pressed, index) => {
		if (pressed)
			vec = vec2.add(vec, cardinals.at(index)!)
	})

	return vec2.normalize(vec)
}

