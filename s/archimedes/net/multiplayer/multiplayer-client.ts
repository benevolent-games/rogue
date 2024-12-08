
import Sparrow, {StdCable} from "sparrow-rtc"
import {pubsub, Signal, signal} from "@benev/slate"

import {Identity} from "./types.js"
import {MetaHost} from "./meta/host.js"
import {Fiber} from "../../../tools/fiber.js"
import {Parcel} from "../relay/inbox-outbox.js"
import {GameMessage} from "../relay/messages.js"
import {Multiplayer} from "./utils/multiplayer.js"
import {Cathedral, Lobby} from "../relay/cathedral.js"
import {renrakuChannel} from "./utils/renraku-channel.js"
import {MetaClient, metaClientApi} from "./meta/client.js"
import {MultiplayerFibers, multiplayerFibers} from "./utils/multiplayer-fibers.js"

export class MultiplayerClient extends Multiplayer {
	constructor(
			public replicatorId: number,
			public gameFiber: Fiber<Parcel<GameMessage>>,
			public identity: Signal<Identity>,
			public lobby: Signal<Lobby>,
			public dispose: () => void,
			public disconnected: () => void,
		) {
		super()
	}

	static async make({fibers, identity, dispose, disconnected}: {
			fibers: MultiplayerFibers,
			identity: Signal<Identity>,
			dispose: () => void,
			disconnected: () => void,
		}) {
		const lobby = signal<Lobby>(Cathedral.emptyLobby())
		const metaHost = renrakuChannel<MetaClient, MetaHost>({
			timeout: 20_000,
			bicomm: fibers.meta.reliable,
			localFns: metaClientApi({lobby}),
		})
		const {author} = await metaHost.hello(identity.value)
		identity.on(identity => { metaHost.hello(identity) })
		return new this(author, fibers.game, identity, lobby, dispose, disconnected)
	}

	static async join(invite: string, identity: Signal<Identity>, disconnected: () => void) {
		const onDisconnected = pubsub()
		onDisconnected(disconnected)

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

			const multiplayerClient = await this.make({
				fibers,
				identity,
				disconnected: () => {},
				dispose: () => sparrow.connection.disconnect(),
			})

			onDisconnected(() => {
				multiplayerClient.lobby.value = Cathedral.emptyLobby()
			})

			return multiplayerClient
		}
		catch (error) {
			sparrow.connection.disconnect()
			throw error
		}
	}
}

