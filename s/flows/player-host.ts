
import {Signal} from "@benev/slate"

import {clientFlow} from "./client.js"
import {context} from "../dom/context.js"
import {LagProfile} from "../tools/fake-lag.js"
import {dedicatedHostFlow} from "./dedicated-host.js"
import {Identity} from "../logic/multiplayer/types.js"
import {MultiplayerClient} from "../logic/multiplayer/multiplayer-client.js"
import {FullRegistration, LocalLobbyist} from "../logic/multiplayer/lobby/manager.js"
import {MultiplayerFibers, multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"

export async function playerHostFlow(o: {lag: LagProfile | null, identity: Signal<Identity>}) {
	const host = await dedicatedHostFlow()

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	const contact = host.clientele.add({
		fibers: hostFibers,
		lag: o.lag,
		updateIdentity: identity => registration.identity = identity,
	})

	const registration: FullRegistration = {
		replicatorId: contact.replicatorId,
		identity: context.multiplayerIdentity.value,
	}

	host.lobbyManager.add<LocalLobbyist>({
		kind: "local",
		registration,
	})

	const multiplayerClient = await MultiplayerClient.make(clientFibers, context.multiplayerIdentity)
	const client = await clientFlow(multiplayerClient)

	const disposePlayer = host.acceptNewPlayer(contact)

	function dispose() {
		disposePlayer()
		multiplayerClient.dispose()
		client.dispose()
		host.dispose()
	}

	return {host, contact, client, dispose}
}

