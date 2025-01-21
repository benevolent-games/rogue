
import {Scalar} from "@benev/toolbox"

export class Smoothie {
	x: number

	constructor(public target: number) {
		this.x = target
	}

	step(delta: number) {
		return this.x = Scalar.step(this.x, this.target, delta)
	}

	approach(speed: number, seconds: number) {
		return this.x = Scalar.approach(this.x, this.target, speed, seconds)
	}
}

