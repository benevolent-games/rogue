
import {pubsub, Signal, signal} from "@benev/slate"
import Sparrow, {StdCable} from "sparrow-rtc"

import {Lobby} from "./lobby/lobby.js"
import {LobbyDisplay} from "./lobby/types.js"
import {Multiplayer} from "./utils/multiplayer.js"
import {MultiplayerFibers, multiplayerFibers} from "./utils/multiplayer-fibers.js"
import {renrakuChannel} from "./utils/renraku-channel.js"
import {MetaClient, metaClientApi} from "./meta/client.js"
import {MetaHost} from "./meta/host.js"
import {Parcel} from "../framework/relay/inbox-outbox.js"
import {Fiber} from "../../tools/fiber.js"
import {GameMessage} from "../framework/relay/messages.js"

export class MultiplayerClient extends Multiplayer {

	static async make(fibers: MultiplayerFibers) {
		const lobbyDisplay = signal<LobbyDisplay>(Lobby.emptyDisplay())
		const metaHost = renrakuChannel<MetaClient, MetaHost>({
			timeout: 20_000,
			bicomm: fibers.meta.reliable,
			localFns: metaClientApi({lobbyDisplay}),
		})
		const {replicatorId} = await metaHost.hello({identity: "Frank"})
		return new this(replicatorId, fibers.game, lobbyDisplay, () => {})
	}

	static async join(invite: string) {
		const onDisconnected = pubsub()
		const sparrow = await Sparrow.join<StdCable>({
			rtcConfigurator: Sparrow.turnRtcConfigurator,
			invite,
			disconnected: () => {
				onDisconnected.publish()
				console.warn(`disconnected from host`)
			},
		})

		try {
			const fibers = multiplayerFibers()
			const megafiber = Fiber.multiplex(fibers)
			megafiber.proxyCable(sparrow.connection.cable)

			const multiplayerClient = await this.make(fibers)
			onDisconnected(() => {
				multiplayerClient.lobbyDisplay.value = Lobby.emptyDisplay()
			})

			return multiplayerClient
		}
		catch (error) {
			sparrow.connection.disconnect()
			throw error
		}
	}

	constructor(
			public replicatorId: number,
			public gameFiber: Fiber<Parcel<GameMessage>>,
			public lobbyDisplay: Signal<LobbyDisplay>,
			public dispose: () => void,
		) {
		super(lobbyDisplay)
	}
}

