
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {DungeonLayout} from "../../dungeons/dungeon-layout.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state}) => {

	const dungeon = new DungeonLayout(state.options)
	station.physics.resetUnwalkableHashgrid(dungeon.unwalkables.list())

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {
			station.physics.resetUnwalkableHashgrid([])
		},
	}
})

