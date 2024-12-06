
import {Suite} from "cynic"
import {loop} from "@benev/toolbox"

import {Station} from "./demo/station.js"
import {simulas} from "./demo/entities/simulas.js"
import {GameEntities} from "./demo/entities/entities.js"
import {GameState} from "./framework/parts/game-state.js"
import {Simulator} from "./framework/simulation/simulator.js"

export default <Suite>{
	async "simulation"() {
		const station = new Station()
		const gameState = new GameState<GameEntities>()
		const simulation = new Simulator<GameEntities, Station>(station, gameState, simulas)

		gameState.create("bootstrap", null)

		for (const tick of loop(10))
			simulation.simulate(tick, [])
	},
}

