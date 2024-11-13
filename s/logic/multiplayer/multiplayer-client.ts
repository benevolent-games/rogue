
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

		// TODO establish some kind of meta-communicative channel, to transmit replicatorId
		// 🧐 perhaps a way to perform fiber-splitting,
		// maybe we can split a fiber into multiple sub-fibers which each get a namespace
		// and their messages are wrapped, and it's done opaquely so a sub-fiber is just
		// an ordinary fiber and doesn't have to worry about it.
		// ie, we split the cable fiber into two sub-fibers,
		//  - administrative fiber -- for transmitting replicator id from host to client (maybe renraku)
		//  - game fiber -- for streaming parcelled game data (too raw for renraku)

		// TODO
		// i think we should create a ParcelFiber which handles are inbox/outbox parcelization,
		// thus making liaison simpler..
	
		return new this(lobbyDisplay, sparrow.connection, sparrow.close, replicatorId)
	}

	constructor(
			lobbyDisplay: Signal<LobbyDisplay>,
			public connection: Connection,
			public dispose: () => void,
			public replicatorId: number,
		) {
		super(lobbyDisplay)
	}
}

