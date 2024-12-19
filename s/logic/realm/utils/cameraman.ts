
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
	distance: number
}

const blankState = (): CameramanState => ({
	pivot: new Coordinates(0, 0),
	swivel: Degrees.toRadians(45),
	tilt: Degrees.toRadians(20),
	distance: 20,
})

const alphaReset = Degrees.toRadians(-90)
const tiltBounds = new Vec2(Degrees.toRadians(1), Degrees.toRadians(60))

export class Cameraman {
	camera: ArcRotateCamera
	state = blankState()
	#smooth = blankState()

	lerp = 10 / 100

	constructor(scene: Scene, public lighting: Lighting) {
		this.camera = new ArcRotateCamera(
			"camera",
			alphaReset - this.state.swivel,
			this.state.tilt,
			this.state.distance,
			Vector3.Zero(),
			scene,
		)
	}

	reset() {
		this.state = blankState()
	}

	setStateWithoutSmoothing(state: CameramanState) {
		this.state = state
		this.#smooth = state
	}

	tick() {
		this.#enforceConstraints()
		this.#updateSmoothedState()
		this.#updateCamera()
		this.#updateSpotlight()
	}

	#enforceConstraints() {
		this.state.tilt = Scalar.clamp(this.state.tilt, tiltBounds.x, tiltBounds.y)
	}

	#updateSmoothedState() {
		const {lerp} = this
		this.#smooth.pivot.lerp(this.state.pivot, lerp)
		this.#smooth.swivel = Scalar.lerp(this.#smooth.swivel, this.state.swivel, lerp)
		this.#smooth.tilt = Scalar.lerp(this.#smooth.tilt, this.state.tilt, lerp)
		this.#smooth.distance = Scalar.lerp(this.#smooth.distance, this.state.distance, lerp)
	}

	#updateCamera() {
		this.camera.target.set(...this.#smooth.pivot.position().array())
		this.camera.alpha = alphaReset - this.#smooth.swivel
		this.camera.beta = this.#smooth.tilt
		this.camera.radius = Scalar.remap(this.#smooth.tilt, tiltBounds.x, tiltBounds.y, 30, 10)
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

