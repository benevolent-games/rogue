
import {Scalar} from "@benev/toolbox"

export const Circular = {
	normalize(x: number) {
		return Scalar.wrap(x, 0, 2 * Math.PI)
	},

	lerp(current: number, target: number, fraction: number): number {
		let delta = target - current
		if (delta > Math.PI) delta -= 2 * Math.PI
		if (delta < -Math.PI) delta += 2 * Math.PI
		return this.normalize(current + delta * fraction)
	},
}

