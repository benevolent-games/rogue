
import {Degrees, Vec3} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {Lighting} from "./lighting.js"
import {Coordinates} from "./coordinates.js"
import {constants} from "../../../constants.js"

export class Cameraman {
	camera: ArcRotateCamera
	#coordinates = new Coordinates(0, 0)

	constructor(scene: Scene, public lighting: Lighting) {
		this.camera = new ArcRotateCamera(
			"camera",
			Degrees.toRadians(-90) - constants.game.cameraRotation,
			Degrees.toRadians(20),
			20,
			Vector3.Zero(),
			scene,
		)
	}

	get target() {
		return this.#coordinates
	}

	set target(coords: Coordinates) {
		this.#coordinates = coords
		this.camera.target.set(
			...coords
				.position()
				.array()
		)
		this.#updateSpotlight()
	}

	get position() {
		return Vec3.from(this.camera.position.asArray())
	}

	#updateSpotlight() {
		const targetPosition = this.#coordinates.position()
		const cameraPosition = this.position
		const cameraLookingVector = targetPosition.clone().subtract(cameraPosition)
		const cameraNormal = cameraLookingVector.clone().normalize()

		this.lighting.spot.position.set(...cameraPosition.array())
		this.lighting.spot.direction.set(...cameraNormal.array())
	}
}

