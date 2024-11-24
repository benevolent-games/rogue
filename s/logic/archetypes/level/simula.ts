
import {Station} from "../../station/station.js"
import {LevelArchetype, LevelConfig} from "./types.js"

export const levelSimula = Station.simula<LevelArchetype>()(
	(config: LevelConfig) => () => {

	console.log("🔥 LEVEL SIMULA")

	return {
		facts: {config},
		simulate({feed, feedback}) {},
		dispose() {},
	}
})

