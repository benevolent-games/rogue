
import {Degrees, Scalar, Vec2, Vec3} from "@benev/toolbox"

import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {Lighting} from "./lighting.js"
import {Coordinates} from "./coordinates.js"

type CameramanState = {
	pivot: Coordinates
	swivel: number
	tilt: number
}

const alphaReset = Degrees.toRadians(-90)
const tiltBounds = new Vec2(Degrees.toRadians(1), Degrees.toRadians(40))
const distanceBounds = new Vec2(10, 20)

export class Cameraman {
	static blankState(): CameramanState {
		return {
			pivot: new Coordinates(0, 0),
			swivel: Degrees.toRadians(45),
			tilt: Degrees.toRadians(20),
		}
	}

	camera: ArcRotateCamera
	state = Cameraman.blankState()
	#smooth = Cameraman.blankState()

	lerp = 10 / 100

	constructor(scene: Scene, public lighting: Lighting) {
		this.camera = new ArcRotateCamera(
			"camera",
			alphaReset - this.#smooth.swivel,
			this.#smooth.tilt,
			this.#calculateDistance(),
			Vector3.Zero(),
			scene,
		)
	}

	resetRotations() {
		const blank = Cameraman.blankState()
		this.state.swivel = blank.swivel
		this.state.tilt = blank.tilt
	}

	pivotInstantly(pivot: Coordinates) {
		this.state.pivot.set(pivot)
		this.#smooth.pivot.set(pivot)
		this.#updateCamera()
	}

	tick() {
		this.#enforceConstraints()
		this.#updateSmoothedState()
		this.#updateCamera()
		this.#updateSpotlight()
	}

	#calculateDistance() {
		return Scalar.remap(
			this.#smooth.tilt,
			tiltBounds.x,
			tiltBounds.y,
			distanceBounds.y,
			distanceBounds.x,
		)
	}

	#enforceConstraints() {
		this.state.tilt = Scalar.clamp(this.state.tilt, tiltBounds.x, tiltBounds.y)
	}

	#updateSmoothedState() {
		const {lerp} = this
		this.#smooth.pivot.lerp(this.state.pivot, lerp)
		this.#smooth.swivel = Scalar.lerp(this.#smooth.swivel, this.state.swivel, lerp)
		this.#smooth.tilt = Scalar.lerp(this.#smooth.tilt, this.state.tilt, lerp)
	}

	#updateCamera() {
		this.camera.target.set(...this.#smooth.pivot.position().array())
		this.camera.alpha = alphaReset - this.#smooth.swivel
		this.camera.beta = this.#smooth.tilt
		this.camera.radius = this.#calculateDistance()
	}

	#updateSpotlight() {
		const targetPosition = this.#smooth.pivot.position()
		const cameraPosition = Vec3.from(this.camera.position.asArray())
		const cameraLookingVector = targetPosition.clone().subtract(cameraPosition)
		const cameraNormal = cameraLookingVector.clone().normalize()
		this.lighting.spot.position.set(...cameraPosition.array())
		this.lighting.spot.direction.set(...cameraNormal.array())
	}
}

