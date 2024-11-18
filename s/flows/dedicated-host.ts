
import {deep, interval} from "@benev/slate"

import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {LobbyManager} from "../logic/multiplayer/lobby/manager.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"
import {Clientele, Contact} from "../logic/framework/relay/clientele.js"

export async function dedicatedHostFlow() {
	const lobbyManager = new LobbyManager()
	const station = new Station()
	const simulator = new Simulator(station, simulas)
	const clientele = new Clientele()

	const stopSnapshots = interval(1000, () => {
		const snapshot = deep.clone(simulator.snapshot())
		clientele.broadcastSnapshot(snapshot)
	})

	const stopTicks = interval.hz(60, () => {
		const feedbacks = clientele.collectAllFeedbacks()
		simulator.simulate(feedbacks)
		const feed = deep.clone(simulator.collector.take())
		clientele.broadcastFeed(feed)
	})

	function acceptNewPlayer(contact: Contact) {
		const playerId = simulator.create("player", {
			owner: contact.replicatorId,
			coordinates: Coordinates.zero(),
		})

		return () => {
			simulator.destroy(playerId)
		}
	}

	async function startMultiplayer() {
		return MultiplayerHost.host({
			clientele,
			lobbyManager,
			hello: acceptNewPlayer,
		})
	}

	const dispose = () => {
		stopSnapshots()
		stopTicks()
		lobbyManager.dispose()
		clientele.dispose()
	}

	return {station, lobbyManager, simulator, clientele, acceptNewPlayer, startMultiplayer, dispose}
}

