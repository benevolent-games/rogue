
import {Suite} from "cynic"
import {loop} from "@benev/toolbox"

import {DemoRealm} from "./demo/realm.js"
import {DemoStation} from "./demo/station.js"
import {demoSimulas} from "./demo/entities/simulas.js"
import {demoReplicas} from "./demo/entities/replicas.js"
import {GameEntities} from "./demo/entities/entities.js"
import {GameState} from "./framework/parts/game-state.js"
import {Simulator} from "./framework/simulation/simulator.js"
import {Replicator} from "./framework/replication/replicator.js"

function setupSimulation() {
	const station = new DemoStation()
	const gameState = new GameState<GameEntities>()
	const simulator = new Simulator<GameEntities, DemoStation>(station, gameState, demoSimulas)
	return {station, gameState, simulator}
}

function setupReplication() {
	const simulation = setupSimulation()
	const realm = new DemoRealm()
	const replication = new Replicator<GameEntities, DemoRealm>(realm, demoReplicas)
	return {...simulation, realm, replication}
}

export default <Suite>{
	async "local simulation"() {
		const {gameState, simulator} = setupSimulation()
		gameState.create("bootstrap", null)
		for (const tick of loop(10))
			simulator.simulate(tick, [])
	},
	async "replicated simulation agrees"() {
		// const station = new DemoStation()
		// const gameState = new GameState<GameEntities>()
		// const simulation = new Simulator<GameEntities, DemoStation>(station, gameState, demoSimulas)
		//
		// const realm = new DemoRealm()
		// const replication = new Replicator<GameEntities, DemoRealm>(realm, demoReplicas)
		//
		// gameState.create("bootstrap", null)
		//
		// for (const tick of loop(10))
		// 	simulation.simulate(tick, [])
	},
}

