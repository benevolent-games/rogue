
import {Scalar} from "@benev/toolbox"

export class Smoothie {
	x: number

	constructor(public target: number) {
		this.x = target
	}

	step(delta: number) {
		return this.x = Scalar.step(this.x, this.target, delta)
	}

	lerp(fraction: number) {
		return this.x = Scalar.lerp(this.x, this.target, fraction)
	}
}

