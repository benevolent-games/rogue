
import {Signal, signal} from "@benev/slate"
import Sparrow, {Connection, StdCable} from "sparrow-rtc"

import {Lobby} from "./lobby/lobby.js"
import {MetaHost} from "./meta/host.js"
import {Fiber} from "../../tools/fiber.js"
import {LobbyDisplay} from "./lobby/types.js"
import {Multiplayer} from "./utils/multiplayer.js"
import {renrakuChannel} from "./utils/renraku-channel.js"
import {MetaClient, metaClientApi} from "./meta/client.js"
import {multiplayerFibers} from "./utils/multiplayer-fibers.js"

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

		const fibers = multiplayerFibers()
		const megafiber = Fiber.multiplex(fibers)
		megafiber.entangleCable(sparrow.connection.cable)

		const meta = renrakuChannel<MetaClient, MetaHost>({
			timeout: 20_000,
			bicomm: fibers.meta.reliable,
			localFns: metaClientApi({lobbyDisplay}),
		})

		const {replicatorId} = await meta.hello({identity: "Fred"})
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

