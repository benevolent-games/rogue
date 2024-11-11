
import {Signal, signal} from "@benev/slate"
import Sparrow, {Connection, StdCable} from "sparrow-rtc"

import {Lobby} from "./lobby/lobby.js"
import {LobbyDisplay} from "./lobby/types.js"
import {Multiplayer} from "./utils/multiplayer.js"

export class MultiplayerClient extends Multiplayer {

	static async join(invite: string) {
		const lobbyDisplay = signal<LobbyDisplay>(Lobby.emptyDisplay())

		const sparrow = await Sparrow.join<StdCable>({
			rtcConfigurator: Sparrow.turnRtcConfigurator,
			invite,
			disconnected: () => {
				lobbyDisplay.value = Lobby.emptyDisplay()
				console.warn(`disconnected from host`)
			},
		})

		sparrow.connection.cable.reliable.onmessage = ({data}) => {
			const json = JSON.parse(data) as {kind: "lobby", lobbyDisplay: LobbyDisplay}
			if (json.kind !== "lobby")
				throw new Error(`unknown message kind "${json.kind}"`)
			lobbyDisplay.value = json.lobbyDisplay
		}

		return new this(lobbyDisplay, sparrow.connection, sparrow.close)
	}

	constructor(
			lobbyDisplay: Signal<LobbyDisplay>,
			public connection: Connection,
			public dispose: () => void,
		) {
		super(lobbyDisplay)
	}
}

