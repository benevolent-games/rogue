
import {Vec2, Vec3} from "@benev/toolbox"

export class Coordinates {
	static planarToWorld(v: Vec2) {
		const x = v.x * -1
		const y = 0
		const z = v.y
		return Vec3.new(x, y, z)
	}
}

