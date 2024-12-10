

import {Vec2} from "@benev/toolbox"
import {CrusaderInputData} from "../types.js"
import {constants} from "../../../../constants.js"
import {cardinals} from "../../../../tools/directions.js"
import {GameTact} from "../../../realm/utils/make-tact.js"

export function getPlayerInput(tact: GameTact): CrusaderInputData {
	const {buttons} = tact.inputs.basic
	const intent = Vec2.zero()

	const directions = [
		buttons.moveNorth.input.down,
		buttons.moveEast.input.down,
		buttons.moveSouth.input.down,
		buttons.moveWest.input.down,
	]

	directions.forEach((pressed, index) => {
		if (pressed)
			intent.add(cardinals.at(index)!)
	})

	const sprint = buttons.sprint.input.down

	return {
		sprint,
		movementIntent: intent
			.normalize()
			.rotate(constants.game.cameraRotation)
			.array(),
	}
}

