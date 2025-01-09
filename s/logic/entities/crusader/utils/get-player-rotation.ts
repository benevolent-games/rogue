
import {Degrees} from "@benev/toolbox"
import {Vec2Fns} from "../../../../tools/temp/vec2-fns.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export function getPlayerRotation(
		cursorCoordinates: Coordinates,
		playerCoordinates: Coordinates,
	) {

	return Degrees.toRadians(180) + Vec2Fns.asRotation(
		cursorCoordinates
			.clone()
			.subtract(playerCoordinates)
	)
}

