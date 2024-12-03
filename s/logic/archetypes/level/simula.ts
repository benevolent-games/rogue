
import {LevelArchetype} from "./types.js"
import {Station} from "../../station/station.js"
import {DungeonOptions} from "../../dungeons/layouting/types.js"
import {DungeonLayout} from "../../dungeons/dungeon-layout.js"

export const levelSimula = Station.simula<LevelArchetype>()(
	(dungeonOptions: DungeonOptions) => ({station}) => {

	const dungeon = new DungeonLayout(dungeonOptions)
	station.physics.resetUnwalkableHashgrid(dungeon.unwalkables.list())

	return {
		facts: {dungeonOptions},
		simulate({feed, feedback}) {},
		dispose() {
			station.physics.resetUnwalkableHashgrid([])
		},
	}
})

