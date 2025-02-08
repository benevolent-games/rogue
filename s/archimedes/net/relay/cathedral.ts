
import {repeat} from "@benev/slate"
import Sparrow, {AgentInfo, Connection, ConnectivityKind} from "sparrow-rtc"

import {Fiber} from "./fiber.js"
import {Liaison} from "./liaison.js"
import {LagProfile} from "../../../tools/fake-lag.js"
import {IdCounter} from "../../../tools/id-counter.js"
import {MetaClient} from "../multiplayer/meta/client.js"
import {MetaHost, metaHostApi} from "../multiplayer/meta/host.js"
import {renrakuChannel} from "../multiplayer/utils/renraku-channel.js"
import {InputPayload, Snapshot, SnapshotPayload} from "../../framework/parts/types.js"
import {MultiplayerFibers, multiplayerFibers} from "../multiplayer/utils/multiplayer-fibers.js"

export type Seat<Identity> = {
	kind: "local" | "remote"
	agent: AgentInfo | undefined
	bundle: Bundle<Identity> | undefined
}

export type Bundle<Identity> = {
	author: number
	liaison: Liaison
	metaClient: MetaClient
	connection: Connection | undefined
	identity: Identity | undefined
	connectionStats: LobbyConnectionStats | undefined
	dispose: () => void
}

export type Lobby<Identity> = {
	invite: string | undefined
	online: boolean
	seats: LobbySeat<Identity>[]
}

export type LobbySeat<Identity> = {
	kind: "local" | "remote"
	author: number | undefined
	agent: AgentInfo | undefined
	identity: Identity | undefined
	connectionStats: LobbyConnectionStats | undefined
}

export type LobbyConnectionStats = {
	kind: ConnectivityKind | "unknown"
	ping: number | undefined
}

export type CathedralOptions<Identity> = {
	lag: LagProfile | null
	onBundle: (bundle: Bundle<Identity>) => () => void
}

export class Cathedral<Identity> {
	static emptyLobby<Identity>(): Lobby<Identity> {
		return {invite: undefined, online: false, seats: []}
	}

	authorIds = new IdCounter(1)
	seats = new Set<Seat<Identity>>()

	invite: string | undefined = undefined
	online = false

	constructor(private options: CathedralOptions<Identity>) {}

	#computeLobby(): Lobby<Identity> {
		return {
			invite: this.invite,
			online: this.online,
			seats: [...this.seats].map(seat => {
				const {kind, agent, bundle} = seat
				return {
					kind,
					agent,
					author: bundle?.author,
					identity: bundle?.identity,
					connectionStats: bundle?.connectionStats,
				}
			}),
		}
	}

	makeLocalSeat(fibers: MultiplayerFibers) {
		const bundle = this.#bundlize(fibers, undefined)
		const seat: Seat<Identity> = {kind: "local", agent: undefined, bundle}
		this.seats.add(seat)
		return {seat, bundle}
	}

	reserveRemoteSeat(agent: AgentInfo) {
		const seat: Seat<Identity> = {kind: "remote", agent, bundle: undefined}
		this.seats.add(seat)
		return seat
	}

	attachRemoteBundle(seat: Seat<Identity>, connection: Connection) {
		const fibers = multiplayerFibers()
		const megafiber = Fiber.multiplex(fibers)
		megafiber.proxyCable(connection.cable)
		seat.bundle = this.#bundlize(fibers, connection)
		return seat.bundle
	}

	deleteSeat(seat: Seat<Identity>) {
		const {bundle} = seat
		if (this.seats.has(seat)) {
			this.seats.delete(seat)
			if (bundle)
				bundle.dispose()
		}
	}

	getBundles() {
		return [...this.seats]
			.filter(seat => seat.bundle)
			.map(seat => seat.bundle) as Bundle<Identity>[]
	}

	collectivize() {
		type Result = {snapshot: SnapshotPayload | null, inputPayloads: InputPayload[]}
		const result: Result = {snapshot: null, inputPayloads: []}
		for (const bundle of this.getBundles()) {
			const {snapshot, inputPayloads} = bundle.liaison.take()
			if (snapshot)
				result.snapshot = snapshot
			result.inputPayloads.push(...inputPayloads)
		}
		return result
	}

	broadcastSnapshot(snapshot: SnapshotPayload) {
		for (const bundle of this.getBundles())
			bundle.liaison.sendSnapshot(snapshot)
	}

	broadcastInputs(inputPayload: InputPayload) {
		for (const bundle of this.getBundles())
			bundle.liaison.sendInputs(inputPayload)
	}

	distributeTailoredSnapshots(tick: number, fn: (bundle: Bundle<Identity>) => Snapshot) {
		for (const bundle of this.getBundles())
			bundle.liaison.sendSnapshot({tick, data: fn(bundle)})
	}

	dispose() {
		for (const seat of [...this.seats])
			this.deleteSeat(seat)
	}

	#bundlize(fibers: MultiplayerFibers, connection: Connection | undefined) {
		const author = this.authorIds.next()
		const liaison = new Liaison(fibers.game, this.options.lag)

		const updateIdentity = (id: Identity) => { bundle.identity = id }

		const metaClient = renrakuChannel<MetaHost, MetaClient>({
			timeout: 20_000,
			bicomm: fibers.meta.reliable,
			localFns: metaHostApi({author, updateIdentity}),
		})

		const connectionStats: LobbyConnectionStats = {
			kind: "unknown",
			ping: undefined,
		}

		const stopStats = repeat(1_000, async() => {
			if (connection?.peer) {
				const report = await Sparrow.reportConnectivity(connection.peer)
				connectionStats.kind = report.kind
			}
		})

		const stopLobbyUpdates = repeat(1_000, async() => {
			const alpha = Date.now()
			await metaClient.updateLobby(this.#computeLobby())
			connectionStats.ping = Date.now() - alpha
		})

		const bundle: Bundle<Identity> = {
			connection,
			author,
			liaison,
			metaClient,
			connectionStats,
			identity: undefined,
			dispose: () => {
				bundleOff()
				stopStats()
				stopLobbyUpdates()
				liaison.dispose()
				if (connection) {
					connection.disconnect()
					bundle.connection = undefined
				}
			},
		}

		const bundleOff = this.options.onBundle(bundle)
		return bundle
	}
}

