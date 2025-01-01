
import {Signal} from "@benev/slate"
import {clientFlow} from "./client.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {dedicatedHostFlow} from "./dedicated-host.js"
import {Identity} from "../../archimedes/net/multiplayer/types.js"
import {MultiplayerClient} from "../../archimedes/net/multiplayer/multiplayer-client.js"
import {MultiplayerFibers, multiplayerFibers} from "../../archimedes/net/multiplayer/utils/multiplayer-fibers.js"

export async function playerHostFlow(o: {
		lag: LagProfile | null
		identity: Signal<Identity>
	}) {

	console.log("LOL 1")

	const host = await dedicatedHostFlow(o)

	console.log("LOL 2")

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	host.cathedral.makeLocalSeat(hostFibers)

	console.log("LOL 3")

	const multiplayerClient = await MultiplayerClient.make({
		fibers: clientFibers,
		identity: o.identity,
		dispose: () => {},
		disconnected: () => {},
	})

	console.log("LOL 4")

	const client = await clientFlow(multiplayerClient, host.smartloop)

	console.log("LOL 5")

	function dispose() {
		multiplayerClient.dispose()
		client.dispose()
		host.dispose()
	}

	console.log("LOL 6")

	return {host, multiplayerClient, client, dispose}
}

