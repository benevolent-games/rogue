
import {Vec2} from "@benev/toolbox"
import {interval, nap} from "@benev/slate"

import {World} from "../tools/babylon/world.js"

import {Realm} from "../logic/realm/realm.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {Replicator} from "../logic/framework/replication/replicator.js"

import {fakeLag} from "../tools/fake-lag.js"
import { SoloHub } from "../logic/framework/relay/net.js"
// import {emptyFeed, emptyFeedback, Feed, Feedback} from "../logic/framework/relay/types.js"

export async function soloFlow() {
	const world = await World.load()
	const realm = new Realm(world)
	const station = new Station()

	const simulator = new Simulator(station, simulas)
	const replicator = new Replicator(realm, replicas, 0)

	simulator.create("player", {owner: replicator.id, position: Vec2.zero()})

	const hub = new SoloHub(simulator, replicator)

	const stop = interval.hz(60, () => {
		simulator.simulate(hub.nethost.takeAllFeedbacks())
		replicator.replicate(hub.netclient.collector.take())
	})

	// const memory = {
	// 	feed: emptyFeed() as Feed,
	// 	feedback: emptyFeedback() as Feedback,
	// }
	//
	// const lag = fakeLag({
	// 	ping: 200,
	// 	jitter: 50,
	// 	loss: 10 / 100,
	// 	spikeMultiplier: 2,
	// 	spikeTime: 500,
	// 	smoothTime: 3000,
	// })
	//
	// const stopSimulation = interval(1000 / 60, () => {
	// 	simulator.simulate([[replicator.id, memory.feedback]])
	// 	const feed = simulator.feedCollector.take()
	// 	memory.feed = feed
	// })
	//
	// const stopReplication = interval(1000 / 60, () => {
	// 	replicator.replicate(memory.feed)
	// 	const feedback = replicator.collector.take()
	// 	memory.feedback = feedback
	// })

	// const stopInterval = interval(1000 / 60, () => {
	// 	{
	// 		const feed = simulator.simulate(memory.feedback)
	// 		memory.feedback = []
	// 		lag(() => { memory.feed = feed })
	// 	}
	// 	{
	// 		const replicatorFeedback = replicator.replicate(memory.feed)
	// 		memory.feed = emptyFeed()
	// 		lag(() => { memory.feedback = [[replicator.id, replicatorFeedback]] })
	// 	}
	// })

	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	return {
		realm,
		dispose: () => {
			stop()
			hub.dispose()
			// stopSimulation()
			// stopReplication()
			world.dispose()
		},
	}
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

