
import {deep, interval, signal} from "@benev/slate"

import {Realm} from "../logic/realm/realm.js"
import {World} from "../tools/babylon/world.js"
import {LagProfile} from "../tools/fake-lag.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {Liaison} from "../logic/framework/relay/liaison.js"
import {Clientele} from "../logic/framework/relay/clientele.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {Replicator} from "../logic/framework/replication/replicator.js"
import {MultiplayerFibers, multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"
import {MetaHost} from "../logic/multiplayer/meta/host.js"
import {renrakuChannel} from "../logic/multiplayer/utils/renraku-channel.js"
import {MetaClient, metaClientApi} from "../logic/multiplayer/meta/client.js"
import {LobbyDisplay} from "../logic/multiplayer/lobby/types.js"
import {Lobby} from "../logic/multiplayer/lobby/lobby.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"
import {Fiber} from "../tools/fiber.js"

export async function setupDedicatedHost() {
	const station = new Station()
	const simulator = new Simulator(station, simulas)
	const clientele = new Clientele()

	const dispose = interval.hz(60, () => {
		const feedbacks = clientele.collectAllFeedbacks()
		simulator.simulate(feedbacks)
		const feed = deep.clone(simulator.collector.take())
		clientele.broadcastFeed(feed)
	})

	async function startMultiplayer() {
		return MultiplayerHost.host({
			hello: connection => {
				const fibers = multiplayerFibers()
				const megafiber = Fiber.multiplex(fibers)
				megafiber.proxyCable(connection.cable)
				const contact = clientele.add(fibers)
				return () => {
					clientele.delete(contact)
				}
			},
		})
	}

	return {station, simulator, clientele, startMultiplayer, dispose}
}

export async function setupClient(fibers: MultiplayerFibers) {

	const lobbyDisplay = signal<LobbyDisplay>(Lobby.emptyDisplay())
	const metaHost = renrakuChannel<MetaClient, MetaHost>({
		timeout: 20_000,
		bicomm: fibers.meta.reliable,
		localFns: metaClientApi({lobbyDisplay}),
	})

	const {replicatorId} = await metaHost.hello({identity: "Frank"})
	const world = await World.load()
	const realm = new Realm(world)
	const replicator = new Replicator(realm, replicas, replicatorId)
	const liaison = new Liaison(fibers.game)

	const stopTicking = interval.hz(60, () => {
		const {feed} = liaison.take()
		replicator.ping = liaison.pingponger.averageRtt
		replicator.replicate(feed)
		const feedback = deep.clone(replicator.collector.take())
		liaison.sendFeedback(feedback)
	})

	// init 3d rendering
	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	function dispose() {
		stopTicking()
		world.dispose()
	}

	return {world, realm, replicator, liaison, dispose}
}





export async function hostFlow(o: {lag: LagProfile | null}) {
	const host = await setupDedicatedHost()

	const hostFibers = multiplayerFibers()
	const clientFibers: MultiplayerFibers = {
		meta: hostFibers.meta.makeEntangledPartner(),
		game: hostFibers.game.makeEntangledPartner(),
	}

	const contact = host.clientele.add(hostFibers, o.lag)
	const client = await setupClient(clientFibers)

	function dispose() {
		client.dispose()
		host.dispose()
	}

	return {host, contact, client, dispose}
}

// export async function hostFlow___old() {
// 	const {host, contact, client} = await setupPlayerHost({lag: null})
//
// 	// initial game state
// 	host.simulator.create("player", {
// 		owner: contact.replicatorId,
// 		coordinates: Coordinates.zero(),
// 	})
//
//
// 	// start up multiplayer
// 	const multiplayerOp = opSignal<MultiplayerHost>()
// 	const multiplayer = multiplayerOp.load(async() => MultiplayerHost.host({
// 		hello: connection => {
// 			const fibers = multiplayerFibers()
// 			const megafiber = Fiber.multiplex(fibers)
// 			megafiber.proxyCable(connection.cable)
//
// 			const contact = host.clientele.add(fibers)
//
// 			return () => {
// 				host.clientele.delete(contact)
// 			}
// 		},
// 	}))
//
// 	return {
// 		realm: client.realm,
// 		multiplayerOp,
// 		dispose: () => {
// 			stopTicking()
// 			client.world.dispose()
// 			multiplayer
// 				.then(m => m.dispose())
// 				.catch(() => {})
// 		},
// 	}
// }
//
