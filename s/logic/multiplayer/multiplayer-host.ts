
import {repeat} from "@benev/slate"
import Sparrow, {AgentInfo, Connection, StdCable} from "sparrow-rtc"

import {Identity} from "./types.js"
import {Fiber} from "../../tools/fiber.js"
import {Multiplayer} from "./utils/multiplayer.js"
import {multiplayerFibers} from "./utils/multiplayer-fibers.js"
import {Clientele, Contact} from "../framework/relay/clientele.js"
import {ConnectionInfo, LobbyManager, Registration, RemoteLobbyist} from "./lobby/manager.js"

export type ClientHandle = {
	connection: Connection
	lobbyist: RemoteLobbyist
	contact: Contact
	dispose: () => {}
}

export class MultiplayerHost extends Multiplayer {

	constructor(
			public lobbyManager: LobbyManager,
			public self: AgentInfo,
			public dispose: () => void,
		) {
		super(lobbyManager.lobby)
	}

	static async host({clientele, lobbyManager, hello}: {
			clientele: Clientele
			lobbyManager: LobbyManager
			hello: (contact: Contact) => () => void
		}) {

		const sparrow = await Sparrow.host<StdCable>({
			rtcConfigurator: Sparrow.turnRtcConfigurator,

			// client incoming
			welcome: prospect => {
				const lobbyist = lobbyManager.add<RemoteLobbyist>({
					kind: "remote",
					agent: {id: prospect.id, reputation: prospect.reputation},
					registration: null,
					connectionInfo: null,
				})

				const disposeLobbyist = () => {
					lobbyManager.delete(lobbyist)
				}

				prospect.onFailed(disposeLobbyist)

				return connection => {
					const fibers = multiplayerFibers()
					const megafiber = Fiber.multiplex(fibers)
					megafiber.proxyCable(connection.cable)

					const contact = clientele.add({
						fibers,
						lag: null,
						updateIdentity: (identity: Identity) => {
							registration.identity = identity
							lobbyManager.pulse()
						},
					})

					const connectionInfo: ConnectionInfo = {
						kind: "unknown",
						ping: null,
					}

					const registration: Registration = {
						identity: null,
						replicatorId: contact.replicatorId,
					}

					lobbyist.registration = registration
					lobbyist.connectionInfo = connectionInfo

					const stopStats = repeat(3_000, async() => {
						const report = await Sparrow.reportConnectivity(connection.peer)
						connectionInfo.kind = report.kind
					})

					const goodbye = hello(contact)

					return () => {
						stopStats()
						disposeLobbyist()
						clientele.delete(contact)
						goodbye()
					}
				}
			},
			closed: () => {
				lobbyManager.goOffline()
				console.warn("sparrow signaller disconnected")
			},
		})

		lobbyManager.goOnline({
			agent: sparrow.self,
			invite: sparrow.invite,
		})

		const stopRepeating = repeat(3_000, async() => {
			for (const contact of clientele.list())
				contact.metaClient.lobby(lobbyManager.lobby.value)
		})

		const disconnect = () => {
			stopRepeating()
			sparrow.close()
			lobbyManager.goOffline()
		}

		return new this(lobbyManager, sparrow.self, disconnect)
	}
}

