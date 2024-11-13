
import {interval} from "@benev/slate"

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
import { Inbox, Outbox } from "../logic/framework/relay/inbox-outbox.js"
import { FeedbackMessage, FeedMessage, Message } from "../logic/framework/relay/messages.js"
import { FeedbackCollector } from "../logic/framework/relay/feedback-collector.js"
import { FeedCollector } from "../logic/framework/relay/feed-collector.js"
import { ClientComms, HostComms } from "../logic/framework/relay/comms.js"

export async function loopbackFlow() {

	// "serverside" concerns
	const station = new Station()
	const simulator = new Simulator(station, simulas)
	const hostComms = new HostComms()

	// "clientside" concerns
	const liaison = hostComms.makeLiaison({
		sendReliable: message => {},
		sendUnreliable: message => {},
	})
	const world = await World.load()
	const realm = new Realm(world)
	const replicator = new Replicator(realm, replicas, liaison.replicatorId)
	const clientComms = new ClientComms()

	simulator.create("player", {
		owner: replicator.id,
		coordinates: Coordinates.zero(),
	})

	const stopTicking = interval.hz(60, () => {

		// receive feedbacks from clients
		const feedbacks = hostComms.collectAllFeedbacks()

		// game simulation tick
		simulator.simulate(feedbacks)

		// collect feed from the simulation
		const feed = simulator.collector.take()

		// send feed to clients



		// hub.executeNetworkReceiving()
		// simulator.simulate(hub.nethost.takeAllFeedbacks())
		// replicator.replicate(hub.netclient.collector.take())
		// hub.executeNetworkSending()
	})

	world.rendering.setCamera(realm.env.camera)
	world.gameloop.start()

	return {
		realm,
		dispose: () => {
			stopTicking()
			world.dispose()
		},
	}
}

