
import {Vec2} from "@benev/toolbox"
import {GameEntities} from "../entities.js"
import {DemoStation} from "../../station.js"
import {simula} from "../../../framework/simulation/types.js"

export const soldierSimula = simula<GameEntities, DemoStation>()<"soldier">(
	({id, station, simulator}) => {

	return {
		inputData: {movement: Vec2.zero().array()},
		simulate: (_, state, input) => {

			// process movement
			const movement = Vec2.from(input.data.movement)
			const location = Vec2.from(state.location)
			const newLocation = location.clone().add(movement)
			state.location = newLocation.array()

			// handle death by landmine
			const exploded = station.checkForDetonations(newLocation).length > 0
			if (exploded)
				simulator.delete(id)
		},
		dispose: () => {},
	}
})

