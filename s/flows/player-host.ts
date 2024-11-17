
import {pubsub, Signal} from "@benev/slate"

import {clientFlow} from "./client.js"
import {context} from "../dom/context.js"
import {LagProfile} from "../tools/fake-lag.js"
import {dedicatedHostFlow} from "./dedicated-host.js"
import {Identity} from "../logic/multiplayer/types.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {MultiplayerClient} from "../logic/multiplayer/multiplayer-client.js"
import {MultiplayerFibers, multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"

export async function playerHostFlow(o: {lag: LagProfile | null, identity: Signal<Identity>}) {
	const host = await dedicatedHostFlow()

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	const onSelfIdentity = pubsub<[Identity]>()

	const contact = host.clientele.add({
		fibers: hostFibers,
		lag: o.lag,
		updateIdentity: id => onSelfIdentity.publish(id),
	})

	const multiplayerClient = await MultiplayerClient.make(clientFibers, context.multiplayerIdentity)
	const client = await clientFlow(multiplayerClient)

	// host.simulator.create("player", {
	// 	owner: client.replicator.id,
	// 	coordinates: Coordinates.zero(),
	// })

	function dispose() {
		multiplayerClient.dispose()
		client.dispose()
		host.dispose()
	}

	async function startMultiplayer() {
		const multiplayer = await host.startMultiplayer()
		multiplayer.lobby.addSelf(multiplayer.self)
	}

	return {contact, client, onSelfIdentity, dispose}
}

