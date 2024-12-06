
import {Station} from "../../station.js"
import {GameEntities} from "../entities.js"
import {simula} from "../../../framework/simulation/types.js"

export const bootstrapSimula = simula<GameEntities, Station>()<"bootstrap">(
	({gameState}) => {

	return {
		simulate: (tick, state, inputs) => {
			console.log(tick)
		},
		dispose: () => {},
	}
})

