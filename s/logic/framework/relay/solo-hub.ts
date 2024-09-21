
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

		this.nethost = new Nethost(simulator, hertz)

		const handle = this.nethost.acceptConnection({
			replicatorId: replicator.id,
			feedbackCollector: new FeedbackCollector(),
			sendFacts: x => lossyLag(() => this.netclient.receiveFacts(deep.clone(x))),
			sendEvents: x => losslessLag(() => this.netclient.receiveEvents(deep.clone(x))),
		})

		this.netclient = new Netclient({
			replicator,
			sendRateHz: hertz,
			sendDatas: x => lossyLag(() => handle.receiveDatas(deep.clone(x))),
			sendMemos: x => losslessLag(() => handle.receiveMemos(deep.clone(x))),
		})
	}

	dispose() {
		this.nethost.dispose()
		this.netclient.dispose()
	}
}

