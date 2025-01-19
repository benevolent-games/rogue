
import {Randy, Scalar} from "@benev/toolbox"
import {constants} from "../../../../constants.js"

export class DrunkHeading {
	private smoothing = 3 / 100
	private randy = new Randy()

	private targetFrequency = 1
	private targetAmplitude = 1

	private smoothFrequency = new Scalar(1)
	private smoothAmplitude = new Scalar(1)

	private phase = 0
	private lastUpdateTime = 0

	update(tick: number) {
		if (tick % 60 === 0) {
			this.targetFrequency = this.randy.range(2, 4)
			this.targetAmplitude = this.randy.range(0, 1)
		}

		this.smoothFrequency.lerp(this.targetFrequency, this.smoothing)
		this.smoothAmplitude.lerp(this.targetAmplitude, this.smoothing)

		const time = tick * (1 / constants.sim.tickRate)
		const deltaTime = time - this.lastUpdateTime;

		this.phase += deltaTime * this.smoothFrequency.x
		this.lastUpdateTime = time

		return Math.sin(this.phase) * this.smoothAmplitude.x
	}
}

