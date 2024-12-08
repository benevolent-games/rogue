
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	(_) => {

	return {
		inputData: {
			movementIntent: [0, 0],
			sprint: false,
		},
		simulate: (_) => {},
		dispose: () => {},
	}
})

