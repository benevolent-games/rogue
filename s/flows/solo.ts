
import {Vec2} from "@benev/toolbox"
import {interval} from "@benev/slate"

import {World} from "../tools/babylon/world.js"

import {Realm} from "../logic/realm/realm.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {SoloHub} from "../logic/framework/relay/solo-hub.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {Replicator} from "../logic/framework/replication/replicator.js"
import { LagProfile } from "../tools/fake-lag.js"

export async function soloFlow() {
	const world = await World.load()
	const realm = new Realm(world)
	const station = new Station()

	const simulator = new Simulator(station, simulas)
	const replicator = new Replicator(realm, replicas, 0)

	simulator.create("player", {owner: replicator.id, coordinates: Coordinates.zero()})

	const nice: LagProfile = {
		ping: 50,
		jitter: 10,
		loss: 1 / 100,
		spikeMultiplier: 1.25,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const mid: LagProfile = {
		ping: 100,
		jitter: 10,
		loss: 1 / 100,
		spikeMultiplier: 1.25,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const bad: LagProfile = {
		ping: 300,
		jitter: 150,
		loss: 20 / 100,
		spikeMultiplier: 3,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const hub = new SoloHub(simulator, replicator, 10, mid)

	const stopTicking = interval.hz(60, () => {
		simulator.simulate(hub.nethost.takeAllFeedbacks())
		replicator.replicate(hub.netclient.collector.take())
	})

	const stopNetworking = interval.hz(10, () => {
		hub.executeNetworking()
	})

	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	return {
		realm,
		dispose: () => {
			stopTicking()
			stopNetworking()
			world.dispose()
		},
	}
}

