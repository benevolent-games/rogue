
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Dungeon} from "../../dungeons/dungeon.js"
import {simula} from "../../../packs/archimedes/framework/simulation/types.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({id, station, getState}) => {

	const layout = station.dungeonStore.make(getState().options)
	const dungeon = new Dungeon(layout)
	station.dungeon = dungeon

	station.importantEntities.add(id)

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {
			station.importantEntities.delete(id)
		},
	}
})

