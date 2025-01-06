
import {pubsub} from "@benev/slate"
import {Scalar} from "@benev/toolbox"

export class Smartloop {
	tick = 0
	maxCatchUp = 3
	on = pubsub<[number]>()

	#active = false

	constructor(public hz: number, fn?: (tick: number) => void) {
		if (fn)
			this.on(fn)
	}

	start(fn: (tick: number) => void = () => {}) {
		if (this.#active)
			return () => this.stop()

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

			for (let i = 0; i < howManyTicksToActuallyDo; i++) {
				const tick = this.tick++
				fn(tick)
				on.publish(tick)
			}

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

