
import {deep, interval} from "@benev/slate"

import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"
import {Cathedral, CathedralOptions} from "../logic/framework/relay/cathedral.js"

export async function dedicatedHostFlow(o: CathedralOptions) {
	const cathedral = new Cathedral(o)
	const station = new Station()
	const simulator = new Simulator(station, simulas)

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

	function acceptNewPlayer(replicatorId: number) {
		const playerId = simulator.create("player", {
			owner: replicatorId,
			coordinates: Coordinates.zero(),
		})
		return () => {
			simulator.destroy(playerId)
		}
	}

	async function startMultiplayer() {
		return MultiplayerHost.host({
			cathedral,
			hello: bundle => acceptNewPlayer(bundle.replicatorId),
		})
	}

	const dispose = () => {
		stopSnapshots()
		stopTicks()
		cathedral.dispose()
	}

	return {cathedral, station, simulator, startMultiplayer, dispose}
}

