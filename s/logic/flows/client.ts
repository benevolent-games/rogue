
import {loop, Scalar} from "@benev/toolbox"

import {Realm} from "../realm/realm.js"
import {constants} from "../../constants.js"
import {Simtron} from "../station/simtron.js"
import {replicas} from "../entities/replicas.js"
import {DungeonStore} from "../dungeons/store.js"
import {Smartloop} from "../../tools/smartloop.js"
import {Identity} from "../../ui/accounts/types.js"
import {RogueEntities} from "../entities/entities.js"
import {Liaison} from "../../packs/archimedes/net/relay/liaison.js"
import {InputShell} from "../../packs/archimedes/framework/parts/types.js"
import {Chronicle} from "../../packs/archimedes/framework/parts/chronicle.js"
import {Replicator} from "../../packs/archimedes/framework/replication/replicator.js"
import {MultiplayerClient} from "../../packs/archimedes/net/multiplayer/multiplayer-client.js"

export async function clientFlow(
		multiplayer: MultiplayerClient<Identity>,
		dungeonStore: DungeonStore,
		smartloop = new Smartloop(constants.sim.tickRate),
	) {

	const baseSimtron = new Simtron(dungeonStore)
	const futureSimtron = new Simtron(dungeonStore)

	const {author} = multiplayer
	const csp = true
	const realm = await Realm.load(dungeonStore)
	await realm.loadPostProcessShader("retro", constants.urls.shaders.retro)
	const {world, glbs, stats} = realm

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
			Math.round(discrepancy / (1000 / constants.sim.tickRate)),
			1, // always predicting 1 tick ahead, minimum
			20, // maximum ticks to predict
		)
	}

	const stopTicking = smartloop.on(() => {
		const clockTick = stats.tick.reset().measure()
		const physicsTiming = stats.physics
		physicsTiming.reset()

		const authoritative = liaison.take()

		const clockBase = stats.base.reset().measure()

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
					baseSimtron.simulate(missingTick, [], physicsTiming)
				baseSimtron.simulate(tick, inputs, physicsTiming)
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
		stats.ticksAhead.number = ticksAhead

		// gather, record, and send local inputs
		const localInputs = replicator.gatherInputs(futureTick)
		if (localInputs.length > 0) {
			inputHistory.save(futureTick, localInputs)
			liaison.sendInputs({tick: futureTick, inputs: localInputs})
		}

		clockBase()
		const clockPrediction = stats.prediction.reset().measure()

		// forward prediction
		if (csp) {
			const lastInput = authoritative.inputPayloads.at(-1)?.inputs ?? []

			futureSimtron.gameState.restore(baseSimtron.gameState.snapshot())
			for (const ahead of loop(ticksAhead)) {
				const t = baseTick + ahead
				const localHistoricalInputs = inputHistory.load(t) ?? []
				const inputs = [...lastInput, ...localHistoricalInputs]
				futureSimtron.simulate(t, inputs, physicsTiming)
			}
		}

		clockPrediction()
		clockTick()

		// get the physics awake count stat
		const phys = futureSimtron.station.possibleDungeon?.phys
		if (phys)
			stats.physicsAwake.number = phys.awakeCount
	})

	// init 3d rendering
	world.rendering.setCamera(realm.cameraman.camera)
	world.gameloop.on(() => realm.tick())
	world.gameloop.on(() => replicator.replicate(renderTick))
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

