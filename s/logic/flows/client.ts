
import {loop, Scalar} from "@benev/toolbox"

import {Realm} from "../realm/realm.js"
import {constants} from "../../constants.js"
import {Simtron} from "../station/simtron.js"
import {replicas} from "../entities/replicas.js"
import {DungeonStore} from "../dungeons/store.js"
import {Smartloop} from "../../tools/smartloop.js"
import {RogueEntities} from "../entities/entities.js"
import {Liaison} from "../../archimedes/net/relay/liaison.js"
import {InputShell} from "../../archimedes/framework/parts/types.js"
import {Chronicle} from "../../archimedes/framework/parts/chronicle.js"
import {Replicator} from "../../archimedes/framework/replication/replicator.js"
import {MultiplayerClient} from "../../archimedes/net/multiplayer/multiplayer-client.js"

export async function clientFlow(
		multiplayer: MultiplayerClient,
		dungeonStore: DungeonStore,
		smartloop = new Smartloop(constants.game.tickRate),
	) {

	const baseSimtron = new Simtron(dungeonStore)
	const futureSimtron = new Simtron(dungeonStore)

	const {author} = multiplayer
	const csp = true
	const realm = await Realm.load(dungeonStore)
	await realm.loadPostProcessShader("retro", constants.urls.shaders.retro)
	const {world, glbs} = realm

	const activeGameState = csp
		? futureSimtron.gameState
		: baseSimtron.gameState

	const replicator = new Replicator<RogueEntities, Realm>(author, realm, activeGameState, replicas)
	const liaison = new Liaison(multiplayer.gameFiber)
	const inputHistory = new Chronicle<InputShell<any>[]>(50)

	let baseTick = 0
	let slipTick = 0
	let renderTick = 0

	function getLatencyInTicks() {
		const discrepancy = liaison.pingponger.averageRtt
		return Scalar.clamp(
			Math.round(discrepancy / (1000 / constants.game.tickRate)),
			1, // always predicting 1 tick ahead, minimum
			20, // maximum ticks to predict
		)
	}

	const stopTicking = smartloop.on(() => {
		const authoritative = liaison.take()

		// snapshots from host
		if (authoritative.snapshot) {
			slipTick = 0
			baseTick = authoritative.snapshot.tick
			baseSimtron.gameState.restore(authoritative.snapshot.data)
		}

		// inputs from host
		else if (authoritative.inputPayloads.length > 0) {
			slipTick = 0
			for (const {tick, inputs} of authoritative.inputPayloads) {
				for (let missingTick = baseTick + 1; missingTick < tick; missingTick++)
					baseSimtron.simulate(missingTick, [])
				baseSimtron.simulate(tick, inputs)
				baseTick = tick
			}
		}

		// nothing from host, but time marches forward regardless
		else {
			slipTick =+ 1
		}

		const ticksAhead = getLatencyInTicks() + slipTick
		const futureTick = baseTick + ticksAhead
		renderTick = csp ? futureTick : baseTick

		// gather, record, and send local inputs
		const localInputs = replicator.gatherInputs(futureTick)
		if (localInputs.length > 0) {
			inputHistory.save(futureTick, localInputs)
			liaison.sendInputs({tick: futureTick, inputs: localInputs})
		}

		// forward prediction
		if (csp) {
			futureSimtron.gameState.restore(baseSimtron.gameState.snapshot())
			for (const ahead of loop(ticksAhead)) {
				const t = baseTick + ahead
				const localHistoricalInputs = inputHistory.load(t) ?? []
				futureSimtron.simulate(t, localHistoricalInputs)
			}
		}
	})

	// init 3d rendering
	world.rendering.setCamera(realm.cameraman.camera)
	world.gameloop.on(() => replicator.replicate(renderTick))
	world.gameloop.on(() => realm.tick())
	world.gameloop.start()

	smartloop.start()

	function dispose() {
		stopTicking()
		glbs.dispose()
		world.dispose()
		multiplayer.dispose()
		realm.dispose()
	}

	await Promise.all([
		baseSimtron.station.ready,
		realm.ready.promise,
	])

	return {world, realm, replicator, liaison, dispose}
}

