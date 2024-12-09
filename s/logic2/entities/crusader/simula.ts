
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({station}) => {

	const {physics} = station

	return {
		inputData: {
			movementIntent: [0, 0],
			sprint: false,
		},
		simulate: (_, state, input) => {
			const speed = state.speed
			const speedSprint = state.speedSprint
			const coordinates = Coordinates.from(state.coordinates)

			const sprint = input.data.sprint
			const movementIntent = Coordinates.from(input.data.movementIntent)

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

