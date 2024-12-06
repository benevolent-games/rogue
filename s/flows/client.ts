
import {deep, interval} from "@benev/slate"

import {Glbs} from "../logic/realm/glbs.js"
import {Realm} from "../logic/realm/realm.js"
import {World} from "../tools/babylon/world.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {Liaison} from "../logic/framework/relay/liaison.js"
import {Replicator} from "../logic/framework/replication/replicator.js"
import {MultiplayerClient} from "../logic/multiplayer/multiplayer-client.js"

export async function clientFlow(multiplayer: MultiplayerClient) {
	const world = await World.load()
	const glbs = await Glbs.load(world)
	const realm = new Realm(world, glbs)
	const replicator = new Replicator(realm, replicas, multiplayer.replicatorId)
	const liaison = new Liaison(multiplayer.gameFiber)

	const stopTicking = interval.hz(60, () => {
		const {snapshot, feed} = liaison.take()
		if (snapshot) replicator.applySnapshot(snapshot)
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
		glbs.dispose()
		world.dispose()
		multiplayer.dispose()
	}

	return {world, realm, replicator, liaison, dispose}
}

