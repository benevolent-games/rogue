
import {LagProfile} from "../tools/fake-lag.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {MultiplayerFibers, multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"
import {dedicatedHostFlow} from "./dedicated-host.js"
import {clientFlow} from "./client.js"
import {MultiplayerClient} from "../logic/multiplayer/multiplayer-client.js"

export async function playerHostFlow(o: {lag: LagProfile | null}) {
	const host = await dedicatedHostFlow()

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	const contact = host.clientele.add(hostFibers, o.lag)
	const multiplayerClient = await MultiplayerClient.make(clientFibers)
	const client = await clientFlow(multiplayerClient)

	host.simulator.create("player", {
		owner: client.replicator.id,
		coordinates: Coordinates.zero(),
	})

	function dispose() {
		multiplayerClient.dispose()
		client.dispose()
		host.dispose()
	}

	return {host, contact, client, dispose}
}

