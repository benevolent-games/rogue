
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({station, state}) => {

	// const {physics} = station

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

			coordinates.add(
				movementIntent.clampMagnitude(1).multiplyBy(
					sprint
						? speedSprint
						: speed
				)
			)

			state.coordinates = coordinates.array()
		},
		dispose: () => {},
	}
})

