
import Sparrow from "sparrow-rtc"
import {interval, OpSignal, opSignal} from "@benev/slate"

import {Realm} from "../logic/realm/realm.js"
import {World} from "../tools/babylon/world.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {replicas} from "../logic/archetypes/replicas.js"
import {SoloHub} from "../logic/framework/relay/solo-hub.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {lagProfiles} from "../logic/framework/utils/lag-profiles.js"
import {Replicator} from "../logic/framework/replication/replicator.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"

export async function hostFlow() {
	const world = await World.load()
	const realm = new Realm(world)
	const station = new Station()

	const simulator = new Simulator(station, simulas)
	const replicator = new Replicator(realm, replicas, 0)

	const multiplayerOp = opSignal<MultiplayerHost>()
	const multiplayer = multiplayerOp.load(async() => MultiplayerHost.host())

	simulator.create("player", {
		owner: replicator.id,
		coordinates: Coordinates.zero(),
	})

	const hub = new SoloHub(simulator, replicator, lagProfiles.bad)

	const stopTicking = interval.hz(60, () => {
		hub.executeNetworkReceiving()
		simulator.simulate(hub.nethost.takeAllFeedbacks())
		replicator.replicate(hub.netclient.collector.take())
		hub.executeNetworkSending()
	})

	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

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

