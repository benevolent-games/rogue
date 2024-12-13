
import {Vec3} from "@benev/toolbox"
import {Env} from "./make-environment.js"
import {Coordinates} from "./coordinates.js"

export class Cameraman {
	#coordinates = new Coordinates(0, 0)

	constructor(private env: Env) {}

	get target() {
		return this.#coordinates
	}

	set target(coords: Coordinates) {
		this.#coordinates = coords
		this.env.camera.target.set(
			...coords
				.position()
				.array()
		)
	}

	get position() {
		return Vec3.from(this.env.camera.position.asArray())
	}
}

