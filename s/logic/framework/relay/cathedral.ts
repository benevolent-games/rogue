
import {repeat, signal} from "@benev/slate"
import {AgentInfo, Connection, ConnectivityKind, ConnectivityReport} from "sparrow-rtc"

import {Liaison} from "./liaison.js"
import {Feed, Feedbacks} from "./types.js"
import {Fiber} from "../../../tools/fiber.js"
import {Identity} from "../../multiplayer/types.js"
import {IdCounter} from "../../../tools/id-counter.js"
import {MetaClient} from "../../multiplayer/meta/client.js"
import {MetaHost, metaHostApi} from "../../multiplayer/meta/host.js"
import {renrakuChannel} from "../../multiplayer/utils/renraku-channel.js"
import {MultiplayerFibers, multiplayerFibers} from "../../multiplayer/utils/multiplayer-fibers.js"

export type Seat = {
	kind: "local" | "remote"
	agent: AgentInfo | undefined
	bundle: Bundle | undefined
}

export type Bundle = {
	replicatorId: number
	liaison: Liaison
	metaClient: MetaClient
	connection: Connection | undefined
	identity: Identity | undefined
	connectionStats: LobbyConnectionStats | undefined
	dispose: () => void
}

export type Lobby = {
	invite: string | undefined
	online: boolean
	seats: LobbySeat[]
}

export type LobbySeat = {
	agent: AgentInfo | undefined
	identity: Identity | undefined
	replicatorId: number | undefined
	connectionStats: LobbyConnectionStats | undefined
}

export type LobbyConnectionStats = {
	kind: ConnectivityKind | "unknown"
	ping: number | undefined
}

export class Cathedral {
	replicatorIds = new IdCounter()
	seats = new Set<Seat>()

	invite: string | undefined = undefined
	online = false

	#computeLobby(): Lobby {
		return {
			invite: this.invite,
			online: this.online,
			seats: [...this.seats].map(seat => {
				const {agent, bundle} = seat
				return {
					agent,
					connectionStats: undefined,
					identity: bundle?.identity,
					replicatorId: bundle?.replicatorId,
				}
			}),
		}
	}

	makeLocalSeat(fibers: MultiplayerFibers) {
		const bundle = this.#bundlize(fibers, undefined)
		const seat: Seat = {kind: "local", agent: undefined, bundle}
		this.seats.add(seat)
		return seat
	}

	reserveRemoteSeat(agent: AgentInfo) {
		const seat: Seat = {kind: "remote", agent, bundle: undefined}
		this.seats.add(seat)
		return (connection: Connection) => {
			this.#attachRemoteBundle(seat, connection)
			return () => this.#deleteSeat(seat)
		}
	}

	#attachRemoteBundle(seat: Seat, connection: Connection) {
		const fibers = multiplayerFibers()
		const megafiber = Fiber.multiplex(fibers)
		megafiber.proxyCable(connection.cable)
		seat.bundle = this.#bundlize(fibers, connection)
		return seat.bundle
	}

	#deleteSeat(seat: Seat) {
		const {bundle} = seat
		this.seats.delete(seat)
		if (bundle)
			bundle.dispose()
	}

	getBundles() {
		return [...this.seats]
			.filter(seat => seat.bundle)
			.map(seat => seat.bundle) as Bundle[]
	}

	collectAllFeedbacks(): Feedbacks {
		return this.getBundles()
			.map(b => [b.replicatorId, b.liaison.take().feedback])
	}

	broadcastFeed(feed: Feed) {
		for (const bundle of this.getBundles())
			bundle.liaison.sendFeed(feed)
	}

	broadcastSnapshot(feed: Feed) {
		for (const bundle of this.getBundles())
			bundle.liaison.sendFeed(feed)
	}

	dispose() {
		for (const seat of this.seats)
			this.#deleteSeat(seat)
	}

	#bundlize(fibers: MultiplayerFibers, connection: Connection | undefined) {
		const replicatorId = this.replicatorIds.next()
		const liaison = new Liaison(fibers.game)

		const updateIdentity = (id: Identity) => { bundle.identity = id }

		const metaClient = renrakuChannel<MetaHost, MetaClient>({
			timeout: 20_000,
			bicomm: fibers.meta.reliable,
			localFns: metaHostApi({replicatorId, updateIdentity}),
		})

		const connectionStats: LobbyConnectionStats = {
			kind: "unknown",
			ping: undefined,
		}

		const stopPings = repeat(1_000, async() => {
			const alpha = Date.now()
			await metaClient.ping()
			connectionStats.ping = Date.now() - alpha
		})

		const stopLobbyUpdates = repeat(1_000, async() => {
			metaClient.updateLobby(this.#computeLobby())
		})

		const bundle: Bundle = {
			connection,
			replicatorId,
			liaison,
			metaClient,
			connectionStats,
			identity: undefined,
			dispose: () => {
				stopPings()
				stopLobbyUpdates()
				liaison.dispose()
				if (connection)
					connection.disconnect()
			},
		}

		return bundle
	}
}

