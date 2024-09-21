
import {Vec2, Vec3} from "@benev/toolbox"

export class Coordinates extends Vec2 {
	position() {
		const x = this.x * -1
		const y = 0
		const z = this.y
		return Vec3.new(x, y, z)
	}
}

