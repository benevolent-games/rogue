
import {interval} from "@benev/slate"

import {GameMessage} from "./messages.js"
import {Pingponger} from "./pingponger.js"
import {Fiber} from "../../../tools/fiber.js"
import {disposers} from "../../../tools/disposers.js"
import {Inbox, Outbox, Parcel} from "./inbox-outbox.js"
import {InputShell, Snapshot} from "../../framework/parts/types.js"
import {fakeLag, LagFn, LagProfile} from "../../../tools/fake-lag.js"

export class Liaison {
	pingponger: Pingponger
	pingPeriod = 1_000

	inbox = new Inbox<GameMessage>()
	outbox = new Outbox<GameMessage>()

	lag: LagFn
	lagLossless: LagFn

	dispose: () => void

	constructor(
			public fiber: Fiber<Parcel<GameMessage>>,
			lag: LagProfile | null = null,
		) {

		this.lag = fakeLag(lag)
		this.lagLossless = fakeLag(lag ? {...lag, loss: 0} : null)

		this.pingponger = new Pingponger(p => {
			const parcel = this.outbox.wrap(p)
			this.lag(() => fiber.unreliable.send(parcel))
		})

		this.dispose = disposers(
			interval(this.pingPeriod, () => this.pingponger.ping()),
			fiber.reliable.recv.on(m => this.inbox.give(m)),
			fiber.unreliable.recv.on(m => this.inbox.give(m)),
		)
	}

	sendSnapshot(snapshot: Snapshot) {
		const parcel = this.outbox.wrap(["snapshot", snapshot])
		this.lag(() => this.fiber.unreliable.send(parcel))
	}

	sendInputs(inputs: InputShell<any>[]) {
		const parcel = this.outbox.wrap(["inputs", inputs])
		this.lag(() => this.fiber.unreliable.send(parcel))
	}

	take() {
		let snapshot: Snapshot | null = null
		const inputs: InputShell<any>[] = []

		for (const message of this.inbox.take()) {
			const [kind, x] = message
			switch (kind) {
				case "ping":
				case "pong":
					this.pingponger.receive(message)
					break

				case "snapshot":
					snapshot = x
					break

				case "inputs":
					inputs.push(...x)
					break

				default:
					console.warn(`unknown message kind "${kind}"`)
			}
		}

		return {inputs, snapshot}
	}
}

