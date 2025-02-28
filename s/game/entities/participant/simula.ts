
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../packs/archimedes/framework/simulation/types.js"

export const participantSimula = simula<RogueEntities, Station>()<"participant">(
	({id, station, simulator, getState, fromAuthor}) => {

	const {author} = getState()
	const dungeon = station.dungeon
	station.importantEntities.add(id)

	return {
		simulate: (_tick, inputs) => {
			const state = getState()
			const input = fromAuthor(state.author, inputs).at(-1)

			if (input?.spawnRequest && !state.alive) {
				const {character} = input.spawnRequest
				const spawnpoint = dungeon.getSpawnpoint()
				if (!spawnpoint) {
					console.error("no available space to spawn player")
					return () => {}
				}
				const crusaderEntityId = simulator.create("crusader", {
					author,
					character,
					biped: {
						health: 1,
						rotation: 0,
						coordinates: Coordinates.import(spawnpoint).array(),
						attack: null,
						block: 0,
					},
					mortality: {health: 1},
				})
				state.alive = {
					character,
					crusaderEntityId,
				}
			}

			if (state.alive) {
				const died = !simulator.gameState.entities.has(state.alive.crusaderEntityId)
				if (died) {
					state.alive = null
				}
			}
		},
		dispose: () => {
			const state = getState()
			if (state.alive) simulator.delete(state.alive.crusaderEntityId)
			station.importantEntities.delete(id)
		},
	}
})

