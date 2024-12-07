
import {Vec2} from "@benev/toolbox"
import {GameEntities} from "../entities.js"
import {DemoStation, MineTicket} from "../../station.js"
import {simula} from "../../../framework/simulation/types.js"

export const landmineSimula = simula<GameEntities, DemoStation>()<"landmine">(
	({station, gameState, id}) => {

	const unregisterMine = station.registerLandmine(
		new MineTicket(
			Vec2.new(10, 0),
			2,
			() => gameState.delete(id),
		)
	)

	return {
		simulate: (tick, state, inputs) => {},
		dispose: () => {
			unregisterMine()
		},
	}
})

