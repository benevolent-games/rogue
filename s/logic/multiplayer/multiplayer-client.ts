
import Sparrow, {StdCable} from "sparrow-rtc"
import {pubsub, Signal, signal} from "@benev/slate"

import {Identity} from "./types.js"
import {MetaHost} from "./meta/host.js"
import {Fiber} from "../../tools/fiber.js"
import {Multiplayer} from "./utils/multiplayer.js"
import {Lobby, LobbyManager} from "./lobby/manager.js"
import {Parcel} from "../framework/relay/inbox-outbox.js"
import {renrakuChannel} from "./utils/renraku-channel.js"
import {MetaClient, metaClientApi} from "./meta/client.js"
import {GameMessage} from "../framework/relay/messages.js"
import {MultiplayerFibers, multiplayerFibers} from "./utils/multiplayer-fibers.js"

export class MultiplayerClient extends Multiplayer {

	static async make(fibers: MultiplayerFibers, identity: Signal<Identity>) {
		const lobby = signal<Lobby>(LobbyManager.empty())
		const metaHost = renrakuChannel<MetaClient, MetaHost>({
			timeout: 20_000,
			bicomm: fibers.meta.reliable,
			localFns: metaClientApi({lobby, identity}),
		})
		const {replicatorId} = await metaHost.hello(identity.value)
		identity.on(identity => { metaHost.hello(identity) })
		return new this(replicatorId, fibers.game, identity, lobby, () => {})
	}

	static async join(invite: string, identity: Signal<Identity>) {
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

			const multiplayerClient = await this.make(fibers, identity)
			onDisconnected(() => {
				multiplayerClient.lobby.value = LobbyManager.empty()
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
			public identity: Signal<Identity>,
			public lobby: Signal<Lobby>,
			public dispose: () => void,
		) {
		super(lobby)
	}
}

