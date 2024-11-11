
import Sparrow from "sparrow-rtc"
import {interval} from "@benev/slate"

import {Lobby} from "../logic/lobby/lobby.js"
import {Realm} from "../logic/realm/realm.js"
import {World} from "../tools/babylon/world.js"
import {LagProfile} from "../tools/fake-lag.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {SoloHub} from "../logic/framework/relay/solo-hub.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {Replicator} from "../logic/framework/replication/replicator.js"

export async function hostFlow() {
	const world = await World.load()
	const realm = new Realm(world)
	const station = new Station()

	const simulator = new Simulator(station, simulas)
	const replicator = new Replicator(realm, replicas, 0)

	const lobby = new Lobby()
	let disconnect = () => {}

	try {
		const sparrow = await Sparrow.host({
			welcome: lobby.welcome,
			closed: () => {
				lobby.invite.value = null
				lobby.signallerConnected.value = false
				console.warn("sparrow signaller disconnected")
			},
		})
		lobby.addSelf(sparrow.self)
		lobby.invite.value = sparrow.invite
		lobby.signallerConnected.value = true
		disconnect = () => {
			sparrow.close()
			lobby.disconnectEverybody()
		}
	}
	catch (error) {
		lobby.invite.value = null
		lobby.signallerConnected.value = false
		disconnect = () => {}
	}

	simulator.create("player", {
		owner: replicator.id,
		coordinates: Coordinates.zero(),
	})

	const nice: LagProfile = {
		ping: 20,
		jitter: 5,
		loss: 1 / 100,
		spikeMultiplier: 1.1,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const mid: LagProfile = {
		ping: 70,
		jitter: 10,
		loss: 2 / 100,
		spikeMultiplier: 1.5,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const bad: LagProfile = {
		ping: 120,
		jitter: 20,
		loss: 5 / 100,
		spikeMultiplier: 1.5,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const terrible: LagProfile = {
		ping: 300,
		jitter: 100,
		loss: 10 / 100,
		spikeMultiplier: 1.5,
		spikeTime: 1000,
		smoothTime: 5000,
	}

	const hub = new SoloHub(simulator, replicator, bad)

	const stopTicking = interval.hz(60, () => {
		hub.executeNetworkReceiving()
		simulator.simulate(hub.nethost.takeAllFeedbacks())
		replicator.replicate(hub.netclient.collector.take())
		hub.executeNetworkSending()
	})

	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	return {
		lobby,
		realm,
		dispose: () => {
			stopTicking()
			world.dispose()
		},
	}
}

