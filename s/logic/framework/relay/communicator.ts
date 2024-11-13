import { pubsub } from "@benev/slate"
import { StdCable } from "sparrow-rtc"

export class Communicator<M> {
	receiveReliable = pubsub<[M]>()
	receiveUnreliable = pubsub<[M]>()

	constructor(
		public sendReliable: (m: M) => void,
		public sendUnreliable: (m: M) => void,
		public dispose = () => {},
	) {}

	static fromCable(cable: StdCable) {
		const communicator = new this(
			m => cable.reliable.send(JSON.stringify(m)),
			m => cable.unreliable.send(JSON.stringify(m)),
			disposers(
				onChannelMessage(
					cable.reliable,
					m => communicator.receiveReliable.publish(m),
				),
				onChannelMessage(
					cable.unreliable,
					m => communicator.receiveUnreliable.publish(m),
				),
			),
		)
		return communicator
	}
}

