
import {StdCable} from "sparrow-rtc"
import {pub} from "./pub.js"
import {disposers} from "./disposers.js"
import {onChannelMessage} from "./on-channel-message.js"

export class Bicomm<M> {
	send = pub<[M]>()
	recv = pub<[M]>()
}

export class Fiber<M> {
	reliable = new Bicomm<M>()
	unreliable = new Bicomm<M>()

	static fromCable<M>(cable: StdCable) {
		const fiber = new Fiber<M>()
		fiber.reliable.send.on(m => cable.reliable.send(JSON.stringify(m)))
		fiber.unreliable.send.on(m => cable.reliable.send(JSON.stringify(m)))
		const dispose = disposers(
			onChannelMessage(cable.reliable, s => fiber.reliable.recv(JSON.parse(s))),
			onChannelMessage(cable.unreliable, s => fiber.unreliable.recv(JSON.parse(s))),
		)
		return {fiber, dispose}
	}
}

