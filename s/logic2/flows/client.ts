
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

	const csp = true

	const world = await World.load()
	const glbs = await Glbs.load(world)
	const realm = new Realm(world, glbs)

	function makeSimulator() {
		const station = new Station()
		const gameState = new GameState<RogueEntities>()
		return new Simulator<RogueEntities, Station>(station, gameState, simulas)
	}

	const baseSimulator = makeSimulator()
	const futureSimulator = makeSimulator()

	const activeGameState = csp ? futureSimulator.gameState : baseSimulator.gameState
	const replicator = new Replicator<RogueEntities, Realm>(author, realm, activeGameState, replicas)
	const liaison = new Liaison(multiplayer.gameFiber)

	const inputHistory = new Chronicle<InputShell<any>[]>(50)

	let baseTick = 0
	let futureTick = 0

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
		futureTick = tick + ticksToPredictAhead

		futureSimulator.gameState.restore(snapshot)
		for (const ahead of loop(ticksToPredictAhead)) {
			const t = tick + ahead
			const localHistoricalInputs = inputHistory.load(t) ?? []
			futureSimulator.simulate(t, localHistoricalInputs)
		}
	}

	const stopTicking = interval.hz(constants.game.tickRate, () => {
		const authoritative = liaison.take()

		// gather, record, and send local inputs
		const localInputs = replicator.gatherInputs(futureTick)
		if (localInputs.length > 0) {
			inputHistory.save(futureTick, localInputs)
			liaison.sendInputs({tick: futureTick, inputs: localInputs})
		}

		// snapshots from host
		if (authoritative.snapshot) {
			baseTick = authoritative.snapshot.tick
			baseSimulator.gameState.restore(authoritative.snapshot.data)
		}

		// inputs from host
		else if (authoritative.inputPayloads.length > 0) {
			for (const {tick, inputs} of authoritative.inputPayloads) {
				for (let missingTick = baseTick + 1; missingTick < tick; missingTick++)
					baseSimulator.simulate(missingTick, [])
				baseSimulator.simulate(tick, inputs)
				baseTick = tick
			}
		}

		// forward prediction
		repredict(baseTick, baseSimulator.gameState.snapshot())

		replicator.replicate(csp ? futureTick : baseTick)
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

