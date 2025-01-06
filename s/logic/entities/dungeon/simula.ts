
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Dungeon} from "../../dungeons/dungeon.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state}) => {

	const layout = station.dungeonStore.make(state.options)
	const dungeon = new Dungeon(layout)
	station.dungeon = dungeon

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {},
	}
})

