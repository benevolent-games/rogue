

import {Vec2} from "@benev/toolbox"
import {CrusaderInputData} from "../types.js"
import {Cursor} from "../../../realm/parts/cursor.js"
import {cardinals} from "../../../../tools/directions.js"
import {getPlayerRotation} from "./get-player-rotation.js"
import {GameTact} from "../../../realm/utils/make-tact.js"
import {Cameraman} from "../../../realm/utils/cameraman.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export function getPlayerInput(
		tact: GameTact,
		cameraman: Cameraman,
		cursor: Cursor,
		buddyCoordinates: Coordinates,
	): CrusaderInputData {

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

	const movementIntent = intent
		.normalize()
		.rotate(cameraman.smoothed.swivel)

	const rotation = getPlayerRotation(cursor.coordinates, buddyCoordinates)

	return {
		sprint,
		rotation,
		movementIntent: movementIntent.array(),
	}
}

