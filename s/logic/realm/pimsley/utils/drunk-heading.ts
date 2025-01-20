
import {Randy} from "@benev/toolbox"
import {constants} from "../../../../constants.js"
import {Smoothie} from "../../../../tools/smoothie.js"

export class DrunkHeading {
	#frequency = new Smoothie(1)
	#amplitude = new Smoothie(1)

	#smoothing = 3 / 100
	#randy = new Randy()

	#phase = 0
	#lastUpdateTime = 0

	update(tick: number) {
		if (tick % 60 === 0) {
			this.#frequency.target = this.#randy.range(2, 4)
			this.#amplitude.target = this.#randy.range(0, 1)
		}

		const frequency = this.#frequency.lerp(this.#smoothing)
		const amplitude = this.#amplitude.lerp(this.#smoothing)

		const time = tick * (1 / constants.sim.tickRate)
		const deltaTime = time - this.#lastUpdateTime;

		this.#phase += deltaTime * frequency
		this.#lastUpdateTime = time

		return Math.sin(this.#phase) * amplitude
	}
}

