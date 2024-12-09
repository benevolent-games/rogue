
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import { collectInputFromAuthor } from "../../../archimedes/framework/simulation/utils/collect-input-from-author.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({station}) => {

	const {physics} = station

	return {
		simulate: (_tick, state, inputs) => {
			const speed = state.speed
			const speedSprint = state.speedSprint
			const coordinates = Coordinates.from(state.coordinates)

			const {data} = collectInputFromAuthor<RogueEntities["crusader"]>(state.author, inputs)
			const sprint = data?.sprint ?? false
			const movementIntent = Coordinates.from(data?.movementIntent ?? [0, 0])

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

