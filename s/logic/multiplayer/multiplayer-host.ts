
import Sparrow from "sparrow-rtc"
import {Lobby} from "./lobby/lobby.js"
import {Multiplayer} from "./utils/multiplayer.js"
import { repeat } from "@benev/slate"

export class MultiplayerHost extends Multiplayer {

	static async host() {
		const lobby = new Lobby()
		let disconnect = () => {}

		try {
			const sparrow = await Sparrow.host({
				rtcConfigurator: Sparrow.turnRtcConfigurator,
				welcome: lobby.welcome,
				closed: () => {
					lobby.clear()
					console.warn("sparrow signaller disconnected")
				},
			})

			lobby.init(sparrow)
			const lobbyDisplay = lobby.display

			const stopRepeating = repeat(3_000, async() => {
				for (const lobbyist of lobby.lobbyists.value.values()) {
					if (lobbyist.kind === "client" && lobbyist.connection) {
						lobbyist.connection.cable.reliable.send(JSON.stringify({
							kind: "lobby",
							lobbyDisplay: lobbyDisplay.value,
						}))
					}
				}
			})

			disconnect = () => {
				stopRepeating()
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

