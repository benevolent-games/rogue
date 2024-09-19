
import {Pipe} from "@benev/slate"
import {vec2, Vec2, Vec3} from "@benev/toolbox"

export class Coordinates {
	static planarToWorld(v: Vec2) {
		return Pipe.with(v)
			.to(v => vec2.multiply(v, [-1, 1]))
			.to(([x, z]) => [x, 0, z] as Vec3)
			.done()
	}
}

