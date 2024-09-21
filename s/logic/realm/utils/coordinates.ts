
import {Vec2, Vec3} from "@benev/toolbox"

export class Coordinates extends Vec2 {
	position() {
		const x = this.x * -1
		const y = 0
		const z = this.y
		return Vec3.new(x, y, z)
	}

	toString() {
		return `(Coordinates x${this.x.toFixed(2)}, z${this.y.toFixed(2)})`
	}

	// kinda a hack, should find a way to inherit this
	clone() {
		return new Coordinates(this.x, this.y)
	}
}

