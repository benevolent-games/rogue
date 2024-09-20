
import {Vec2} from "@benev/toolbox"
import {interval} from "@benev/slate"

import {World} from "../tools/babylon/world.js"

import {Realm} from "../logic/realm/realm.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {Feedback} from "../logic/framework/replication/types.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {Replicator} from "../logic/framework/replication/replicator.js"

export async function soloFlow() {
	const station = new Station()
	const simulator = new Simulator(station, simulas)

	const world = await World.load()
	const realm = new Realm(world)

	const replicator = new Replicator(realm, replicas, 0)

	simulator.create("player", {owner: replicator.id, position: Vec2.zero()})

	let feedback: Feedback = []

	const stopInterval = interval(1000 / 60, () => {
		const feed = simulator.simulate(feedback)
		const replicatorFeedback = replicator.replicate(feed)
		feedback = [[replicator.id, replicatorFeedback]]
	})

	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	return {
		realm,
		dispose: () => {
			stopInterval()
			world.dispose()
		},
	}
}

