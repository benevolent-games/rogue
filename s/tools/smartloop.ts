
import {pubsub} from "@benev/slate"
import {Scalar} from "@benev/toolbox"

export class Smartloop {
	maxCatchUp = 5
	#active = false
	#tick = 0

	on = pubsub<[number]>()

	constructor(public hz: number, fn: (tick: number) => void) {
		this.on(fn)
	}

	start() {
		if (this.#active)
			return

		this.#active = true

		const {hz, on, maxCatchUp} = this
		const tickDuration = Math.floor(1000 / hz)
		const from = performance.now()
		let lastTick = 0

		const looper = () => {
			if (!this.#active)
				return

			const since = performance.now() - from
			const ticksSince = Math.floor(since / tickDuration)
			const ticksNotDone = ticksSince - lastTick
			const howManyTicksToActuallyDo = Scalar.clamp(ticksNotDone, 0, maxCatchUp)

			for (let i = 0; i < howManyTicksToActuallyDo; i++)
				on.publish(this.#tick++)

			lastTick = ticksSince
			requestAnimationFrame(looper)
		}

		looper()
		return () => this.stop()
	}

	stop() {
		this.#active = false
	}
}

