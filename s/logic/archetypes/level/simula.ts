
import {LevelArchetype} from "./types.js"
import {Station} from "../../station/station.js"
import {DungeonOptions} from "../../dungeons/types.js"

export const levelSimula = Station.simula<LevelArchetype>()(
	(dungeonOptions: DungeonOptions) => () => {

	return {
		facts: {dungeonOptions},
		simulate({feed, feedback}) {},
		dispose() {},
	}
})

