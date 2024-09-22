
import {deep} from "@benev/slate"

import {Nethost} from "./net-host.js"
import {Netclient} from "./net-client.js"
import {Simulator} from "../simulation/simulator.js"
import {Replicator} from "../replication/replicator.js"
import {FeedbackCollector} from "./feedback-collector.js"
import {fakeLag, LagProfile} from "../../../tools/fake-lag.js"

export class SoloHub {
	static noLag = (fn: () => void) => fn()

	nethost: Nethost
	netclient: Netclient

	constructor(
			public simulator: Simulator<any, any>,
			public replicator: Replicator<any>,
			public hertz: number,
			public lagProfile: LagProfile,
		) {

		const lossyLag = fakeLag(lagProfile)
		const losslessLag = fakeLag({...lagProfile, loss: 0})

		this.nethost = new Nethost(simulator)

		const handle = this.nethost.acceptConnection({
			replicatorId: replicator.id,
			feedbackCollector: new FeedbackCollector(),
			sendReliable: x => losslessLag(() => this.netclient.receive(deep.clone(x))),
			sendUnreliable: x => lossyLag(() => this.netclient.receive(deep.clone(x))),
		})

		this.netclient = new Netclient({
			replicator,
			sendReliable: x => losslessLag(() => handle.receive(deep.clone(x))),
			sendUnreliable: x => lossyLag(() => handle.receive(deep.clone(x))),
		})
	}

	executeNetworking() {
		this.nethost.send()
		this.netclient.send()
		this.nethost.pingponger.ping()
		this.netclient.pingponger.ping()
	}
}

