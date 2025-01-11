
import {Vec2} from "@benev/toolbox"
import {Cursor} from "../../../realm/parts/cursor.js"
import {cardinals} from "../../../../tools/directions.js"
import {getPlayerRotation} from "./get-player-rotation.js"
import {Cameraman} from "../../../realm/utils/cameraman.js"
import {CrusaderInputData, CrusaderState} from "../types.js"
import {UserInputs} from "../../../realm/utils/user-inputs.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export function getPlayerInput(
		state: CrusaderState,
		userInputs: UserInputs,
		cameraman: Cameraman,
		cursor: Cursor,
		buddyCoordinates: Coordinates,
	): CrusaderInputData {

	const {buttons, vectors} = userInputs.tact.inputs.basic
	const walkSpeedFraction = state.speed / state.speedSprint
	const sprint = buttons.sprint.input.down
	const keyIntent = Vec2.zero()

	// stick movement
	const stickIntent = Vec2.from(vectors.move.input.vector)

	// keyboard movement
	{
		const directions = [
			buttons.moveNorth.input.down,
			buttons.moveEast.input.down,
			buttons.moveSouth.input.down,
			buttons.moveWest.input.down,
		]

		directions.forEach((pressed, index) => {
			if (pressed)
				keyIntent.add(cardinals.at(index)!)
		})

		keyIntent
			.normalize()
			.multiplyBy(sprint ? 1 : walkSpeedFraction)
	}

	const movementIntent = Vec2.zero()
		.add(stickIntent)
		.add(keyIntent)
		.clampMagnitude(1)
		.rotate(cameraman.smoothed.swivel)

	const rotation = getPlayerRotation(cursor.coordinates, buddyCoordinates)

	return {
		sprint,
		rotation,
		movementIntent: movementIntent.array(),
	}
}

