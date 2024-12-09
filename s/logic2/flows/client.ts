
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
import {GameState} from "../../archimedes/framework/parts/game-state.js"
import {Simulator} from "../../archimedes/framework/simulation/simulator.js"
import {InputHistory} from "../../archimedes/framework/parts/input-history.js"
import {Replicator} from "../../archimedes/framework/replication/replicator.js"
import {MultiplayerClient} from "../../archimedes/net/multiplayer/multiplayer-client.js"

export async function clientFlow(multiplayer: MultiplayerClient) {
	const {author} = multiplayer

	const station = new Station()
	const world = await World.load()
	const glbs = await Glbs.load(world)
	const realm = new Realm(world, glbs)

	const gameState = new GameState()
	const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)
	const replicator = new Replicator<RogueEntities, Realm>(author, realm, gameState, replicas)
	const liaison = new Liaison(multiplayer.gameFiber)

	let tick = 0
	const inputHistory = new InputHistory()

	const stopTicking = interval.hz(constants.game.tickRate, () => {
		tick += 1

		const authoritative = liaison.take()
		const discrepancy = liaison.pingponger.averageRtt
		const ticksToPredictAhead = Scalar.clamp(
			Math.round(discrepancy / (1000 / constants.game.tickRate)),
			1, // always predicting 1 tick ahead, minimum
			100, // maximum ticks to predict
		)

		const localTick = tick + ticksToPredictAhead
		const localInputs = replicator.gatherInputs(localTick)
		if (localInputs.length > 0) {
			inputHistory.add(localTick, localInputs)
			liaison.sendInputs(localInputs)
		}

		// rollback correction
		if (authoritative.snapshot) {
			tick = authoritative.snapshot.tick
			gameState.restore(authoritative.snapshot.data)
			for (const ahead of loop(ticksToPredictAhead)) {
				const localHistoricalInputs = inputHistory.history.get(tick + ahead) ?? []
				simulator.simulate(tick, localHistoricalInputs)
			}
		}

		// simulate normal non-rollback frames
		else {
			simulator.simulate(localTick, localInputs)
			// // TODO perform rollbacks for each authoritative input
			// // according to the number of ticks between the authoritative inputs
			// // and the predicted localTick
			// simulator.simulate(localTick, authoritative.inputs)
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

