
import {Vec2, Vec2Array, Vec3, Xy} from "@benev/toolbox"

export class Coordinates extends Vec2 {
	static from(v: Vec2Array | Xy) {
		return Array.isArray(v)
			? this.array(v)
			: this.import(v)
	}

	static fromPosition(position: Vec3) {
		return new this(0, 0).setPosition(position)
	}

	position() {
		const x = this.x * -1
		const y = 0
		const z = this.y
		return Vec3.new(x, y, z)
	}

	setPosition(position: Vec3) {
		this.x = position.x / -1
		this.y = position.z
		return this
	}

	toString() {
		return `(Coordinates x${this.x.toFixed(2)}, y${this.y.toFixed(2)})`
	}

	// kinda a hack, should find a way to inherit this
	clone() {
		return new Coordinates(this.x, this.y)
	}
}

