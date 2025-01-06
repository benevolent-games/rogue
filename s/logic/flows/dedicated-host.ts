
import {Vec2} from "@benev/toolbox"
import {repeat} from "@benev/slate"

import {constants} from "../../constants.js"
import {Simtron} from "../station/simtron.js"
import {Box2} from "../physics/shapes/box2.js"
import {Watchman} from "../../tools/watchman.js"
import {DungeonStore} from "../dungeons/store.js"
import {Smartloop} from "../../tools/smartloop.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {dungeonStartup} from "../dungeons/startup.js"
import {Coordinates} from "../realm/utils/coordinates.js"
import {Cathedral} from "../../archimedes/net/relay/cathedral.js"
import {stdDungeonOptions} from "../dungeons/layouting/options.js"
import {MultiplayerHost} from "../../archimedes/net/multiplayer/multiplayer-host.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const dungeonStore = new DungeonStore()
	const simtron = new Simtron(dungeonStore)
	const watchman = new Watchman(constants.game.tickRate)
	const dungeonLayout = dungeonStore.make(stdDungeonOptions())

	dungeonStartup(simtron, dungeonLayout)

	const getSpawnpoint = () => {
		const center = dungeonLayout.goalposts.at(0)!
			.clone()
			.add_(0.5, 0.5)
		const proposal = new Box2(center, new Vec2(0.9, 0.9))
		const {dungeon} = simtron.station
		return dungeon.findAvailableSpace(proposal)
	}

	const cathedral = new Cathedral({
		lag,
		onBundle: ({author}) => {
			const spawnpoint = getSpawnpoint()
			if (!spawnpoint) {
				console.error("no available space to spawn player")
				return () => {}
			}
			const playerId = simtron.simulator.create("crusader", {
				author,
				speed: watchman.perSecond(constants.game.crusader.speed),
				speedSprint: watchman.perSecond(constants.game.crusader.speedSprint),
				coordinates: Coordinates.import(spawnpoint).array(),
			})
			console.log("SPAWN PLAYER", spawnpoint)
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
		dungeonStore.clear()
	}

	return {cathedral, dungeonStore, simtron, smartloop, startMultiplayer, dispose}
}

