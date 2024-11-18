
import {Signal} from "@benev/slate"

import {clientFlow} from "./client.js"
import {dedicatedHostFlow} from "./dedicated-host.js"
import {Identity} from "../logic/multiplayer/types.js"
import {CathedralOptions} from "../logic/framework/relay/cathedral.js"
import {MultiplayerClient} from "../logic/multiplayer/multiplayer-client.js"
import {MultiplayerFibers, multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"

export async function playerHostFlow(o: {identity: Signal<Identity>} & CathedralOptions) {
	const host = await dedicatedHostFlow(o)

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	host.cathedral.makeLocalSeat(hostFibers)

	const multiplayerClient = await MultiplayerClient.make(
		clientFibers,
		o.identity,
		() => {},
	)

	const client = await clientFlow(multiplayerClient)

	function dispose() {
		multiplayerClient.dispose()
		client.dispose()
		host.dispose()
	}

	return {host, multiplayerClient, client, dispose}
}

