
import {repeat} from "@benev/slate"
import Sparrow, {AgentInfo, Connection, StdCable} from "sparrow-rtc"

import {Identity} from "./types.js"
import {Lobby} from "./lobby/lobby.js"
import {Fiber} from "../../tools/fiber.js"
import {Multiplayer} from "./utils/multiplayer.js"
import {multiplayerFibers} from "./utils/multiplayer-fibers.js"
import {Clientele, Contact} from "../framework/relay/clientele.js"

export class MultiplayerHost extends Multiplayer {

	constructor(
			public self: AgentInfo,
			public lobby: Lobby,
			public dispose: () => void,
		) {
		super(lobby.display)
	}

	static async host({clientele, hello}: {
			clientele: Clientele
			hello: (contact: Contact) => () => void
		}) {

		const lobby = new Lobby()

		try {
			const sparrow = await Sparrow.host<StdCable>({
				rtcConfigurator: Sparrow.turnRtcConfigurator,
				welcome: prospect => {
					const connected = lobby.welcome(prospect)
					return connection => {
						const fibers = multiplayerFibers()
						const megafiber = Fiber.multiplex(fibers)
						megafiber.proxyCable(connection.cable)
						const contact = clientele.add({
							fibers,
							lag: null,
							updateIdentity: (identity: Identity) => {
								lobby.updateIdentity(prospect.id, identity)
							},
						})

						const disconnected = connected(connection)
						const goodbye = hello(contact)
						return () => {
							clientele.delete(contact)
							disconnected()
							goodbye()
						}
					}
				},
				closed: () => {
					lobby.showDisconnected()
					console.warn("sparrow signaller disconnected")
				},
			})

			lobby.showConnected(sparrow.invite)

			const lobbyDisplay = lobby.display

			const stopRepeating = repeat(3_000, async() => {
				for (const lobbyist of lobby.lobbyists.value.values()) {
					if (lobbyist.kind === "client" && lobbyist.connection) {
						// lobbyist.connection.cable.reliable.send(JSON.stringify({
						// 	kind: "lobby",
						// 	lobbyDisplay: lobbyDisplay.value,
						// }))
					}
				}
			})

			const disconnect = () => {
				stopRepeating()
				sparrow.close()
				lobby.disconnectEverybody()
				lobby.showDisconnected()
			}

			return new this(sparrow.self, lobby, disconnect)
		}
		catch (error) {
			lobby.showDisconnected()
			throw error
		}
	}
}

