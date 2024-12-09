
import {Vec2} from "@benev/toolbox"
import {GameEntities} from "../entities.js"
import {DemoStation} from "../../station.js"
import {simula} from "../../../framework/simulation/types.js"
import {collectInputFromAuthor} from "../../../framework/simulation/utils/collect-input-from-author.js"

export const soldierSimula = simula<GameEntities, DemoStation>()<"soldier">(
	({id, station, simulator}) => {

	return {
		simulate: (_, state, inputs) => {

			// process movement
			const {data} = collectInputFromAuthor<GameEntities["soldier"]>(null, inputs)
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

