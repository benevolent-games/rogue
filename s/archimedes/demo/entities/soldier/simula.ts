
import {DemoStation} from "../../station.js"
import {GameEntities} from "../entities.js"
import {simula} from "../../../framework/simulation/types.js"
import { Vec2 } from "@benev/toolbox"

export const soldierSimula = simula<GameEntities, DemoStation>()<"soldier">(
	({station, gameState}) => {

	return {
		simulate: (tick, state, inputs) => {
			const location = Vec2.from(state.location).add(inputs)
			console.log(tick)
		},
		dispose: () => {},
	}
})

