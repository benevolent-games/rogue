
import {Scalar} from "@benev/toolbox"

export const Circular = {
	normalize(x: number) {
		return Scalar.wrap(x, 0, 2 * Math.PI)
	},

	distance(a: number, b: number) {
		a = Circular.normalize(a)
		b = Circular.normalize(b)
		let delta = b - a
		if (delta > Math.PI) delta -= 2 * Math.PI
		if (delta < -Math.PI) delta += 2 * Math.PI
		return delta
	},

	lerp(current: number, target: number, fraction: number): number {
		const delta = Circular.distance(current, target)
		return this.normalize(current + (delta * fraction))
	},
}

