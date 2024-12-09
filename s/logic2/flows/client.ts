
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
import {InputShell} from "../../archimedes/framework/parts/types.js"
import {Chronicle} from "../../archimedes/framework/parts/chronicle.js"
import {GameState} from "../../archimedes/framework/parts/game-state.js"
import {Simulator} from "../../archimedes/framework/simulation/simulator.js"
import {Replicator} from "../../archimedes/framework/replication/replicator.js"
import {MultiplayerClient} from "../../archimedes/net/multiplayer/multiplayer-client.js"

export async function clientFlow(multiplayer: MultiplayerClient) {
	const {author} = multiplayer

	const station = new Station()
	const world = await World.load()
	const glbs = await Glbs.load(world)
	const realm = new Realm(world, glbs)

	// function makeSituation() {
	// 	const gameState = new GameState<RogueEntities>()
	// 	const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)
	// 	return {gameState, simulator}
	// }
	//
	// const realSituation = makeSituation()
	// const predictedSituation = makeSituation()

	const gameState = new GameState<RogueEntities>()
	const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)

	const replicator = new Replicator<RogueEntities, Realm>(author, realm, gameState, replicas)
	const liaison = new Liaison(multiplayer.gameFiber)

	const inputHistory = new Chronicle<InputShell<any>[]>(50)

	let serverTick = 0
	let localTick = 0

	function calculateNumberOfLocalPredictionTicks() {
		const discrepancy = liaison.pingponger.averageRtt
		return Scalar.clamp(
			Math.round(discrepancy / (1000 / constants.game.tickRate)),
			1, // always predicting 1 tick ahead, minimum
			100, // maximum ticks to predict
		)
	}

	const stopTicking = interval.hz(constants.game.tickRate, () => {
		localTick += 1

		const authoritative = liaison.take()

		// gather, record, and send local inputs
		const localInputs = replicator.gatherInputs(localTick)
		if (localInputs.length > 0) {
			inputHistory.save(localTick, localInputs)
			liaison.sendInputs({tick: localTick, inputs: localInputs})
		}

		// snapshot from server, full rollback correction
		if (authoritative.snapshot) {
			serverTick = authoritative.snapshot.tick
			const ticksToPredictAhead = calculateNumberOfLocalPredictionTicks()
			localTick = serverTick + ticksToPredictAhead

			gameState.restore(authoritative.snapshot.data)
			for (const ahead of loop(ticksToPredictAhead)) {
				const tick = serverTick + ahead
				const localHistoricalInputs = inputHistory.load(tick) ?? []
				simulator.simulate(tick, localHistoricalInputs)
			}
		}

		// inputs from server, rollback correction
		else if (authoritative.inputPayloads.length > 0) {
			console.log("tick")

			// perform each server tick
			for (const {tick, inputs} of authoritative.inputPayloads) {
				const relevantLocalInputs = inputHistory.load(tick) ?? []
			}

			authoritative.inputPayloads.forEach(p => {
				console.log(" - ", p.tick)
			})

			const latestAuthorityTick = authoritative.inputPayloads.reduce((p, c) => Math.max(p, c.tick), serverTick)
			const authorityInputs = authoritative.inputPayloads.flatMap(p => p.inputs)

			const tickGap = localTick - latestAuthorityTick
			// console.log("gap", tickGap)

			simulator.simulate(localTick, localInputs)

			// // TODO perform rollbacks for each authoritative input
			// // according to the number of ticks between the authoritative inputs
			// // and the predicted localTick
			// simulator.simulate(localTick, authoritative.inputs)
		}

		// simulate local prediction
		else {
			simulator.simulate(localTick, localInputs)
		}

		replicator.replicate(localTick)
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

