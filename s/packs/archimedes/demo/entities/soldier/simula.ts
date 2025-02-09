
import {Vec2} from "@benev/toolbox"
import {GameEntities} from "../entities.js"
import {DemoStation} from "../../station.js"
import {simula} from "../../../framework/simulation/types.js"

export const soldierSimula = simula<GameEntities, DemoStation>()<"soldier">(
	({id, station, simulator, getState, fromAuthor}) => {

	return {
		simulate: (_, inputs) => {
			const state = getState()

			let data = {movement: Vec2.zero().array()}
			for (const input of fromAuthor(null, inputs))
				data = input

			// process movement
			const movement = Vec2.from(data?.movement ?? [0, 0])
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

