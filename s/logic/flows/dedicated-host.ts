
import {repeat} from "@benev/slate"
import {Randy} from "@benev/toolbox"

import {constants} from "../../constants.js"
import {Simtron} from "../station/simtron.js"
import {Watchman} from "../../tools/watchman.js"
import {Smartloop} from "../../tools/smartloop.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {DungeonLayout} from "../dungeons/layout.js"
import {Coordinates} from "../realm/utils/coordinates.js"
import {Cathedral} from "../../archimedes/net/relay/cathedral.js"
import {stdDungeonOptions} from "../dungeons/layouting/options.js"
import {MultiplayerHost} from "../../archimedes/net/multiplayer/multiplayer-host.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const simtron = new Simtron()
	const watchman = new Watchman(constants.game.tickRate)

	const dungeonOptions = stdDungeonOptions()
	const dungeonLayout = new DungeonLayout(dungeonOptions)
	const randy = new Randy(dungeonOptions.seed)

	const getSpawnpoint = () => randy.choose(dungeonLayout.spawnpoints.array())
		.clone()
		.add_(0.5, 0.5)

	simtron.simulator.create("dungeon", {options: dungeonOptions})

	const cathedral = new Cathedral({
		lag,
		onBundle: ({author}) => {
			const playerId = simtron.simulator.create("crusader", {
				author,
				speed: watchman.perSecond(constants.game.crusader.speed),
				speedSprint: watchman.perSecond(constants.game.crusader.speedSprint),
				coordinates: Coordinates.import(getSpawnpoint()).array(),
			})
			return () => simtron.simulator.delete(playerId)
		},
	})

	const smartloop = new Smartloop(constants.game.tickRate)

	const stopSnapshots = repeat.hz(constants.game.snapshotRate, async() => {
		const data = simtron.simulator.gameState.snapshot()
		cathedral.broadcastSnapshot({tick: smartloop.tick, data})
	})

	const stopTicks = smartloop.start(tick => {
		const {inputPayloads} = cathedral.collectivize()
		const inputs = inputPayloads.flatMap(payload => payload.inputs)
		simtron.simulate(tick, inputs)
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

	return {cathedral, simulatron: simtron, smartloop, startMultiplayer, dispose}
}

