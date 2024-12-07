
import {Vec2} from "@benev/toolbox"
import {GameEntities} from "../entities.js"
import {DemoStation} from "../../station.js"
import {simula} from "../../../framework/simulation/types.js"

export const bootstrapSimula = simula<GameEntities, DemoStation>()<"bootstrap">(
	({gameState}) => {

	return {
		simulate: (tick, state, inputs) => {
			if (tick === 0) {
				console.log(gameState)
				gameState.create("landmine", {
					location: Vec2.new(0, 0).array(),
					detonationProximity: 2,
				})
			}
		},

		dispose: () => {},
	}
})

