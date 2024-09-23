
import {deep} from "@benev/slate"

import {Nethost} from "./net-host.js"
import {Message} from "./messages.js"
import {Netpipe} from "./inbox-outbox.js"
import {Netclient} from "./net-client.js"
import {Simulator} from "../simulation/simulator.js"
import {Replicator} from "../replication/replicator.js"
import {FeedbackCollector} from "./feedback-collector.js"
import {fakeLag, LagProfile} from "../../../tools/fake-lag.js"

export class SoloHub {
	nethost: Nethost
	netclient: Netclient
	executeNetworkReceiving: () => void

	constructor(
			public simulator: Simulator<any, any>,
			public replicator: Replicator<any>,
			public lagProfile: LagProfile,
		) {

		const lossyLag = fakeLag(lagProfile)
		const losslessLag = fakeLag({...lagProfile, loss: 0})

		console.log("lag profile", lagProfile)

		const pipes = {
			toClient: new Netpipe<Message>(25),
			toHost: new Netpipe<Message>(25),
		}

		this.nethost = new Nethost(simulator)

		const handle = this.nethost.acceptConnection({
			replicatorId: replicator.id,
			feedbackCollector: new FeedbackCollector(),
			sendReliable: x => pipes.toClient.send(deep.clone(x), losslessLag),
			sendUnreliable: x => pipes.toClient.send(deep.clone(x), lossyLag),
		})

		this.netclient = new Netclient({
			replicator,
			sendReliable: x => pipes.toHost.send(deep.clone(x), losslessLag),
			sendUnreliable: x => pipes.toHost.send(deep.clone(x), lossyLag),
		})

		this.executeNetworkReceiving = () => {
			for (const message of pipes.toClient.take())
				this.netclient.receive(message)

			for (const message of pipes.toHost.take())
				handle.receive(message)
		}
	}

	executeNetworkSending() {
		this.nethost.send()
		this.netclient.send()
		this.nethost.pingponger.ping()
		this.netclient.pingponger.ping()
	}
}

