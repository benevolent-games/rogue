
import {Signal} from "@benev/slate"
import {clientFlow} from "./client.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {dedicatedHostFlow} from "./dedicated-host.js"
import {Identity} from "../../app/features/accounts/ui/types.js"
import {MultiplayerClient} from "../../packs/archimedes/net/multiplayer/multiplayer-client.js"
import {MultiplayerFibers, multiplayerFibers} from "../../packs/archimedes/net/multiplayer/utils/multiplayer-fibers.js"

export async function playerHostFlow(o: {
		lag: LagProfile | null
		identity: Signal<Identity>
	}) {

	const host = await dedicatedHostFlow(o)

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	host.cathedral.makeLocalSeat(hostFibers)

	const multiplayerClient = await MultiplayerClient.make({
		fibers: clientFibers,
		identity: o.identity,
		dispose: () => {},
		disconnected: () => {},
	})

	const client = await clientFlow(
		multiplayerClient,
		host.dungeonStore,
		host.smartloop,
	)

	function dispose() {
		multiplayerClient.dispose()
		client.dispose()
		host.dispose()
	}

	return {host, multiplayerClient, client, dispose}
}

