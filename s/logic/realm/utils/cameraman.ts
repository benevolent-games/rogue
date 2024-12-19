
import {Degrees, Radians, Scalar, Vec2, Vec3} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {Lighting} from "./lighting.js"
import {Coordinates} from "./coordinates.js"

const alphaReset = Degrees.toRadians(-90)
const baseSwivel = Degrees.toRadians(45)
const baseTilt = Degrees.toRadians(20)
const baseDistance = 20

const swivelBounds = new Vec2(0, Radians.circle)
const tiltBounds = new Vec2(1, 60)

export class Cameraman {
	camera: ArcRotateCamera

	#coordinates = new Coordinates(0, 0)
	#gimbal = new Vec2(baseSwivel, baseTilt)

	constructor(scene: Scene, public lighting: Lighting) {
		this.camera = new ArcRotateCamera(
			"camera",
			alphaReset - baseSwivel,
			baseTilt,
			baseDistance,
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

	get swivel() {
		return this.#gimbal.x
	}

	set swivel(x: number) {
		this.#gimbal.x = Scalar.wrap(x, swivelBounds.x, swivelBounds.y)
	}

	get tilt() {
		return this.#gimbal.y
	}

	set tilt(y: number) {
		this.#gimbal.y = Scalar.wrap(y, tiltBounds.x, tiltBounds.y)
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

