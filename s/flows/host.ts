
import {deep, interval, opSignal, signal} from "@benev/slate"

import {Fiber} from "../tools/fiber.js"
import {Realm} from "../logic/realm/realm.js"
import {World} from "../tools/babylon/world.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {Lobby} from "../logic/multiplayer/lobby/lobby.js"
import {Liaison} from "../logic/framework/relay/liaison.js"
import {Parcel} from "../logic/framework/relay/inbox-outbox.js"
import {Clientele} from "../logic/framework/relay/clientele.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {GameMessage} from "../logic/framework/relay/messages.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {MetaHost, metaHostApi} from "../logic/multiplayer/meta/host.js"
import {Replicator} from "../logic/framework/replication/replicator.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"
import {renrakuChannel} from "../logic/multiplayer/utils/renraku-channel.js"
import {MetaClient, metaClientApi} from "../logic/multiplayer/meta/client.js"
import {MultiplayerFibers, multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"

export async function setupHost() {
	const station = new Station()
	const simulator = new Simulator(station, simulas)
	const clientele = new Clientele()
}

export async function setupClient(o: {
		replicatorId: number
		multiplayerFibers: MultiplayerFibers
	}) {
	const world = await World.load()
	const realm = new Realm(world)
	const replicator = new Replicator(realm, replicas, o.replicatorId)
	const liaison = new Liaison(o.multiplayerFibers.game)
}

export async function setupLoopback() {
	const {replicatorId, liaison: hostsideLiaison} = (
		clientele.makeLiaison(metaClient, new Fiber<Parcel<GameMessage>>())
	)
}

export async function hostFlow() {
	const metaClient = metaClientApi({lobbyDisplay: signal(Lobby.emptyDisplay())})

	// host stuff
	const station = new Station()
	const simulator = new Simulator(station, simulas)
	const clientele = new Clientele()
	const {replicatorId, liaison: hostsideLiaison} = (
		clientele.makeLiaison(metaClient, new Fiber<Parcel<GameMessage>>())
	)

	// client stuff
	const world = await World.load()
	const realm = new Realm(world)
	const replicator = new Replicator(realm, replicas, replicatorId)
	const clientsideLiaison = new Liaison(metaClient, new Fiber<Parcel<GameMessage>>())

	// cross-wire the host and the client
	const alice = hostsideLiaison.fiber
	const bob = clientsideLiaison.fiber
	alice.reliable.send.on(m => bob.reliable.recv(m))
	alice.unreliable.send.on(m => bob.unreliable.recv(m))
	bob.reliable.send.on(m => alice.reliable.recv(m))
	bob.unreliable.send.on(m => alice.unreliable.recv(m))

	// initial game state
	simulator.create("player", {
		owner: replicator.id,
		coordinates: Coordinates.zero(),
	})

	// ticker
	const stopTicking = interval.hz(60, () => {

		// host side activity
		{
			const feedbacks = clientele.collectAllFeedbacks()
			simulator.simulate(feedbacks)
			const feed = deep.clone(simulator.collector.take())
			clientele.broadcastFeed(feed)
			hostsideLiaison.sendFeed(feed)
		}

		// client side activity
		{
			const {feed} = clientsideLiaison.take()
			replicator.ping = clientsideLiaison.pingponger.averageRtt
			replicator.replicate(feed)
			const feedback = deep.clone(replicator.collector.take())
			clientsideLiaison.sendFeedback(feedback)
		}
	})

	// init 3d rendering
	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	// start up multiplayer
	const multiplayerOp = opSignal<MultiplayerHost>()
	const multiplayer = multiplayerOp.load(async() => MultiplayerHost.host({
		hello: connection => {
			const fibers = multiplayerFibers()
			const megafiber = Fiber.multiplex(fibers)
			megafiber.entangleCable(connection.cable)

			const {replicatorId} = clientele.makeLiaison(fibers.game)
			const metaClient = renrakuChannel<MetaHost, MetaClient>({
				timeout: 20_000,
				bicomm: fibers.meta.reliable,
				localFns: metaHostApi({replicatorId}),
			})

			return () => {
				clientele.deleteLiaison(replicatorId)
			}
		},
	}))

	return {
		realm,
		multiplayerOp,
		dispose: () => {
			stopTicking()
			world.dispose()
			multiplayer
				.then(m => m.dispose())
				.catch(() => {})
		},
	}
}

