
import {Randy} from "@benev/toolbox"
import {repeat} from "@benev/slate"

import {constants} from "../../constants.js"
import {Station} from "../station/station.js"
import {simulas} from "../entities/simulas.js"
import {Watchman} from "../../tools/watchman.js"
import {Smartloop} from "../../tools/smartloop.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {DungeonLayout} from "../dungeons/layout.js"
import {RogueEntities} from "../entities/entities.js"
import {Coordinates} from "../realm/utils/coordinates.js"
import {GameState, Simulator} from "../../archimedes/exports.js"
import {Cathedral} from "../../archimedes/net/relay/cathedral.js"
import {stdDungeonOptions} from "../dungeons/layouting/options.js"
import {MultiplayerHost} from "../../archimedes/net/multiplayer/multiplayer-host.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const station = new Station()
	const gameState = new GameState()
	const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)
	const watchman = new Watchman(constants.game.tickRate)

	const dungeonOptions = stdDungeonOptions()
	const dungeonLayout = new DungeonLayout(dungeonOptions)
	const randy = new Randy(dungeonOptions.seed)

	const getSpawnpoint = () => randy.choose(dungeonLayout.spawnpoints.array())
		.clone()
		.add_(0.5, 0.5)

	simulator.create("dungeon", {options: dungeonOptions})

	const cathedral = new Cathedral({
		lag,
		onBundle: ({author}) => {
			const playerId = simulator.create("crusader", {
				author,
				speed: watchman.perSecond(constants.game.crusader.speed),
				speedSprint: watchman.perSecond(constants.game.crusader.speedSprint),
				coordinates: Coordinates.import(getSpawnpoint()).array(),
			})
			return () => simulator.delete(playerId)
		},
	})

	const smartloop = new Smartloop(constants.game.tickRate)

	const stopSnapshots = repeat.hz(constants.game.snapshotRate, async() => {
		const data = simulator.gameState.snapshot()
		cathedral.broadcastSnapshot({tick: smartloop.tick, data})
	})

	const stopTicks = smartloop.start(tick => {
		const {inputPayloads} = cathedral.collectivize()
		const inputs = inputPayloads.flatMap(payload => payload.inputs)
		simulator.simulate(tick, inputs)
		if (inputs.length > 0)
			cathedral.broadcastInputs({tick, inputs})
	})

	async function startMultiplayer() {
		return MultiplayerHost.host(cathedral)
	}

	const dispose = () => {
		stopSnapshots()
		stopTicks()
		cathedral.dispose()
	}

	return {cathedral, station, simulator, smartloop, startMultiplayer, dispose}
}

