
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {DungeonLayout} from "../../dungeons/layout.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state}) => {

	const dungeonLayout = new DungeonLayout(state.options)
	station.physics.resetUnwalkableHypergrid(dungeonLayout.wallTiles.list())

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {
			station.physics.resetUnwalkableHypergrid([])
		},
	}
})

