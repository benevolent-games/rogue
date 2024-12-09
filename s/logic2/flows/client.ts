
import {interval} from "@benev/slate"
import {loop, Scalar} from "@benev/toolbox"

import {Glbs} from "../realm/glbs.js"
import {Realm} from "../realm/realm.js"
import {constants} from "../../constants.js"
import {Station} from "../station/station.js"
import {simulas} from "../entities/simulas.js"
import {replicas} from "../entities/replicas.js"
import {World} from "../../tools/babylon/world.js"
import {RogueEntities} from "../entities/entities.js"
import {Liaison} from "../../archimedes/net/relay/liaison.js"
import {Chronicle} from "../../archimedes/framework/parts/chronicle.js"
import {GameState} from "../../archimedes/framework/parts/game-state.js"
import {Simulator} from "../../archimedes/framework/simulation/simulator.js"
import {InputShell, Snapshot} from "../../archimedes/framework/parts/types.js"
import {Replicator} from "../../archimedes/framework/replication/replicator.js"
import {MultiplayerClient} from "../../archimedes/net/multiplayer/multiplayer-client.js"

export async function clientFlow(multiplayer: MultiplayerClient) {
	const {author} = multiplayer

	const world = await World.load()
	const glbs = await Glbs.load(world)
	const realm = new Realm(world, glbs)

	function makeSituation() {
		const station = new Station()
		const gameState = new GameState<RogueEntities>()
		const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)
		return {gameState, simulator}
	}

	const real = makeSituation()
	const predicted = makeSituation()

	const replicator = new Replicator<RogueEntities, Realm>(author, realm, predicted.gameState, replicas)
	const liaison = new Liaison(multiplayer.gameFiber)

	const inputHistory = new Chronicle<InputShell<any>[]>(50)

	let realTick = 0
	let predictedTick = 0

	function calculateNumberOfLocalPredictionTicks() {
		const discrepancy = liaison.pingponger.averageRtt
		return Scalar.clamp(
			Math.round(discrepancy / (1000 / constants.game.tickRate)),
			1, // always predicting 1 tick ahead, minimum
			100, // maximum ticks to predict
		)
	}

	function repredict(tick: number, snapshot: Snapshot) {
		const ticksToPredictAhead = calculateNumberOfLocalPredictionTicks()
		predictedTick = tick + ticksToPredictAhead

		predicted.gameState.restore(snapshot)
		for (const ahead of loop(ticksToPredictAhead)) {
			const t = tick + ahead
			const localHistoricalInputs = inputHistory.load(t) ?? []
			predicted.simulator.simulate(t, localHistoricalInputs)
		}
	}

	const stopTicking = interval.hz(constants.game.tickRate, () => {
		predictedTick += 1

		const authoritative = liaison.take()

		// gather, record, and send local inputs
		const localInputs = replicator.gatherInputs(predictedTick)
		if (localInputs.length > 0) {
			inputHistory.save(predictedTick, localInputs)
			liaison.sendInputs({tick: predictedTick, inputs: localInputs})
		}

		// snapshot rollback correction
		if (authoritative.snapshot) {
			realTick = authoritative.snapshot.tick
			real.gameState.restore(authoritative.snapshot.data)
			repredict(realTick, authoritative.snapshot.data)
		}

		// // inputs from server, rollback correction
		// else if (authoritative.inputPayloads.length > 0) {
		// 	for (const {tick, inputs} of authoritative.inputPayloads) {
		// 		for (let impliedTick = realTick + 1; impliedTick < tick; impliedTick++)
		// 			real.simulator.simulate(impliedTick, [])
		// 		real.simulator.simulate(tick, [...inputs])
		// 		realTick = tick
		// 	}
		// 	repredict(realTick, real.gameState.snapshot())
		// }

		// simulate local prediction
		else {
			predicted.simulator.simulate(predictedTick, localInputs)
		}

		replicator.replicate(predictedTick)
	})

	// init 3d rendering
	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	function dispose() {
		stopTicking()
		glbs.dispose()
		world.dispose()
		multiplayer.dispose()
	}

	return {world, realm, replicator, liaison, dispose}
}

