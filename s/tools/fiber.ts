
import {StdCable} from "sparrow-rtc"
import {pub} from "./pub.js"
import {disposers} from "./disposers.js"
import {onChannelMessage} from "./on-channel-message.js"

/** a virtualized rtc data channel */
export class Bicomm<M> {
	send = pub<[M]>()
	recv = pub<[M]>()
}

/** a virtualized cable */
export class Fiber<M> {
	reliable = new Bicomm<M>()
	unreliable = new Bicomm<M>()

	/** this fiber becomes a proxy of the cable */
	entangleCable(cable: StdCable) {
		this.reliable.send.on(m => cable.reliable.send(JSON.stringify(m)))
		this.unreliable.send.on(m => cable.reliable.send(JSON.stringify(m)))
		return disposers(
			onChannelMessage(cable.reliable, s => this.reliable.recv(JSON.parse(s))),
			onChannelMessage(cable.unreliable, s => this.unreliable.recv(JSON.parse(s))),
		)
	}

	/** create a fiber as a proxy to the given cable */
	static fromCable<M>(cable: StdCable) {
		const fiber = new Fiber<M>()
		fiber.entangleCable(cable)
		return fiber
	}

	/** split a main fiber into several virtual sub fibers */
	static multiplex<C extends {[key: string]: any}>(
			categories: (keyof C)[],
		) {

		const fiber = new Fiber<{[K in keyof C]: [K, C[K]]}[keyof C]>()

		const subfibers = Object.fromEntries(
			categories.map(key_ => {
				const key = key_ as string
				const subfiber = new Fiber()
				subfiber.reliable.send.on(x => fiber.reliable.send([key, x as any]))
				subfiber.unreliable.send.on(x => fiber.unreliable.send([key, x as any]))
				return [key, subfiber]
			})
		) as {[K in keyof C]: Fiber<C[K]>}

		fiber.reliable.recv.on(([key, data]) => {
			const subfiber = subfibers[key as any]
			if (!subfiber) throw new Error(`unknown subfiber "${key as any}"`)
			subfiber.reliable.recv(data as any)
		})

		fiber.unreliable.recv.on(([key, data]) => {
			const subfiber = subfibers[key as any]
			if (!subfiber) throw new Error(`unknown subfiber "${key as any}"`)
			subfiber.unreliable.recv(data as any)
		})

		return {fiber, subfibers}
	}
}

