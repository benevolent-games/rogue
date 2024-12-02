
import {deep, interval} from "@benev/slate"

import {LagProfile} from "../tools/fake-lag.js"
import {Station} from "../logic/station/station.js"
import {Dungeon} from "../logic/dungeons/dungeon.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {stdDungeonOptions} from "../logic/dungeons/options.js"
import {Cathedral} from "../logic/framework/relay/cathedral.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const station = new Station()
	const simulator = new Simulator(station, simulas)

	const dungeonOptions = stdDungeonOptions()
	const dungeon = new Dungeon(dungeonOptions)
	const getSpawnpoint = dungeon.makeSpawnpointGetterFn()

	simulator.create("level", dungeonOptions)

	const cathedral = new Cathedral({
		lag,
		onBundle: ({replicatorId}) => {
			const playerId = simulator.create("player", {
				owner: replicatorId,

				// TODO
				coordinates: Coordinates.new(0.5, 0.5),
				// coordinates: Coordinates.import(getSpawnpoint()),
			})
			return () => simulator.destroy(playerId)
		},
	})

	const stopSnapshots = interval(1000, () => {
		const snapshot = deep.clone(simulator.snapshot())
		cathedral.broadcastSnapshot(snapshot)
	})

	const stopTicks = interval.hz(60, () => {
		const feedbacks = cathedral.collectAllFeedbacks()
		simulator.simulate(feedbacks)
		const feed = deep.clone(simulator.collector.take())
		cathedral.broadcastFeed(feed)
	})

	async function startMultiplayer() {
		return MultiplayerHost.host(cathedral)
	}

	const dispose = () => {
		stopSnapshots()
		stopTicks()
		cathedral.dispose()
	}

	return {cathedral, station, simulator, startMultiplayer, dispose}
}

