
import {expect, Suite} from "cynic"
import {loop, Vec2} from "@benev/toolbox"

import {DemoStation} from "./demo/station.js"
import {demoSimulas} from "./demo/entities/simulas.js"
import {GameEntities} from "./demo/entities/entities.js"
import {GameState} from "./framework/parts/game-state.js"
import {Simulator} from "./framework/simulation/simulator.js"

function setupSimulator() {
	const station = new DemoStation()
	const gameState = new GameState<GameEntities>()
	return new Simulator<GameEntities, DemoStation>(station, gameState, demoSimulas)
}

export default <Suite>{
	async "local simulation"() {
		const simulator = setupSimulator()

		const landmineId = simulator.create("landmine", {
			detonationProximity: 2,
			location: Vec2.new(10, 0).array(),
		})

		const soldierId = simulator.create("soldier", {
			location: Vec2.new(0, 0).array(),
		})

		for (const tick of loop(10))
			simulator.simulate(tick, [{
				author: null,
				entity: soldierId,
				messages: [],
				data: {movement: Vec2.new(1, 0).array()},
			}])

		expect(simulator.gameState.entities.has(landmineId)).equals(false)
		expect(simulator.gameState.entities.has(soldierId)).equals(false)
	},
}

