
import {Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({station, fromAuthor}) => {

	const {physics} = station

	let data: RogueEntities["crusader"]["input"] = {
		sprint: false,
		movementIntent: Vec2.zero().array(),
	}

	return {
		simulate: (_tick, state, inputs) => {
			data = fromAuthor(state.author, inputs).at(-1) ?? data

			const speed = state.speed
			const speedSprint = state.speedSprint
			const coordinates = Coordinates.from(state.coordinates)

			const sprint = data.sprint
			const movementIntent = Coordinates.from(data.movementIntent)

			const proposedCoordinates = coordinates.clone().add(
				movementIntent.clampMagnitude(1).multiplyBy(
					sprint
						? speedSprint
						: speed
				)
			)

			const radius = constants.game.crusaderRadius

			if (physics.isWalkable(proposedCoordinates, radius))
				coordinates.set(proposedCoordinates)

			state.coordinates = coordinates.array()
		},
		dispose: () => {},
	}
})

