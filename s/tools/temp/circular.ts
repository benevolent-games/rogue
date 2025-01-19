
import {Scalar} from "@benev/toolbox"

// TODO
/** @deprecated use Circular from toolbox instead */
export class Circular {
	constructor(public x: number) {}

	static normalize(x: number) {
		return Scalar.wrap(x, 0, 2 * Math.PI)
	} normalize() {
		this.x = Circular.normalize(this.x)
		return this
	}

	static distance(x: number, y: number) {
		x = this.normalize(x)
		y = this.normalize(y)
		let delta = y - x
		if (delta > Math.PI) delta -= 2 * Math.PI
		if (delta < -Math.PI) delta += 2 * Math.PI
		return delta
	} distance(y: number) {
		return Circular.distance(this.x, y)
	}

	static lerp(x: number, y: number, fraction: number) {
		const delta = this.distance(x, y)
		return this.normalize(x + (delta * fraction))
	} lerp(y: number, fraction: number) {
		this.x = Circular.lerp(this.x, y, fraction)
		return this
	}

	static step(x: number, y: number, delta: number) {
		const difference = this.distance(x, y)
		return this.normalize(
			Math.abs(difference) <= delta
				? y
				: x + (Math.sign(difference) * delta)
		)
	} step(y: number, delta: number) {
		this.x = Circular.step(this.x, y, delta)
		return this
	}
}

