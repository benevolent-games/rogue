
// import {repeat} from "@benev/slate"
import Sparrow, {Connection, StdCable} from "sparrow-rtc"

import {Lobby} from "./lobby/lobby.js"
import {Multiplayer} from "./utils/multiplayer.js"

export class MultiplayerHost extends Multiplayer {

	static async host(o: {
			hello: (connection: Connection) => () => void
		}) {

		const lobby = new Lobby()
		let disconnect = () => {}

		try {
			const sparrow = await Sparrow.host<StdCable>({
				rtcConfigurator: Sparrow.turnRtcConfigurator,
				welcome: prospect => {
					const connected = lobby.welcome(prospect)
					return connection => {
						const disconnected = connected(connection)
						const goodbye = o.hello(connection)
						return () => {
							disconnected()
							goodbye()
						}
					}
				},
				closed: () => {
					lobby.clear()
					console.warn("sparrow signaller disconnected")
				},
			})

			lobby.init(sparrow)

			// // LOBBY

			// const lobbyDisplay = lobby.display

			// const stopRepeating = repeat(3_000, async() => {
			// 	for (const lobbyist of lobby.lobbyists.value.values()) {
			// 		if (lobbyist.kind === "client" && lobbyist.connection) {
			// 			lobbyist.connection.cable.reliable.send(JSON.stringify({
			// 				kind: "lobby",
			// 				lobbyDisplay: lobbyDisplay.value,
			// 			}))
			// 		}
			// 	}
			// })

			disconnect = () => {
				// stopRepeating()
				sparrow.close()
				lobby.disconnectEverybody()
			}
		}
		catch (error) {
			lobby.clear()
			throw error
		}

		return new this(lobby, disconnect)
	}

	constructor(public lobby: Lobby, public dispose: () => void) {
		super(lobby.display)
	}
}

