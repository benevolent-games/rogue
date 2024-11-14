
import {deep, interval, signal} from "@benev/slate"

import {Realm} from "../logic/realm/realm.js"
import {World} from "../tools/babylon/world.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {Liaison} from "../logic/framework/relay/liaison.js"
import {Replicator} from "../logic/framework/replication/replicator.js"
import {MultiplayerClient} from "../logic/multiplayer/multiplayer-client.js"

export async function clientFlow(multiplayer: MultiplayerClient) {
	const world = await World.load()
	const realm = new Realm(world)
	const replicator = new Replicator(realm, replicas, multiplayer.replicatorId)
	const liaison = new Liaison(multiplayer.gameFiber)

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

// export async function joinFlow__(multiplayer: MultiplayerClient) {
// 	const fiber = (
// 		Fiber.fromCable<Parcel<GameMessage>>(multiplayer.connection.cable)
// 	)
//
// 	const liaison = new Liaison(fiber)
// 	const world = await World.load()
// 	const realm = new Realm(world)
// 	const replicator = new Replicator(realm, replicas, multiplayer.replicatorId)
//
// 	// ticker
// 	const stopTicking = interval.hz(60, () => {
// 		const {feed} = liaison.take()
// 		replicator.ping = liaison.pingponger.averageRtt
// 		replicator.replicate(feed)
// 		const feedback = replicator.collector.take()
// 		liaison.sendFeedback(feedback)
// 	})
//
// 	// init 3d rendering
// 	world.rendering.setCamera(realm.env.camera)
// 	world.gameloop.start()
//
// 	return {
// 		realm,
// 		multiplayer,
// 		dispose: () => {
// 			stopTicking()
// 			world.dispose()
// 		},
// 	}
// }
//
