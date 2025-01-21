
import {Circular, Degrees, Scalar, Vec3} from "@benev/toolbox"

import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {Lighting} from "./lighting.js"
import {Coordinates} from "./coordinates.js"
import {constants} from "../../../constants.js"

const alphaReset = Degrees.toRadians(-90)

export class CameramanState {
	pivot = new Coordinates(0, 0)
	tilt = constants.camera.initial.tilt
	swivel = constants.camera.initial.swivel

	distance = (
		constants.camera.distanceBounds.x +
		constants.camera.distanceBounds.y
	) * constants.camera.initial.distanceFraction

	clone() {
		const state = new CameramanState()
		state.pivot = this.pivot.clone()
		state.swivel = this.swivel
		state.tilt = this.tilt
		state.distance = this.distance
		return state
	}
}

export class Cameraman {
	camera: ArcRotateCamera

	/** user inputted desired camera state */
	desired = new CameramanState()

	/** state with rules enforced */
	enforced = new CameramanState()

	/** smoothed final results actually displayed */
	smoothed = new CameramanState()

	sharpness = 5

	constructor(scene: Scene, public lighting: Lighting) {
		this.camera = new ArcRotateCamera(
			"camera",
			alphaReset - this.smoothed.swivel,
			this.smoothed.tilt,
			this.smoothed.distance,
			Vector3.Zero(),
			scene,
		)
	}

	get position() {
		return Vec3.from(this.camera.position)
	}

	isCurrentlyTopDown() {
		return (this.smoothed.tilt <= Degrees.toRadians(10))
	}

	reset() {
		this.#unwindSwivelInstantly()
		const {pivot} = this.desired
		this.desired = new CameramanState()
		this.desired.pivot = pivot
	}

	#unwindSwivelInstantly() {
		const swivel = Circular.normalize(this.smoothed.swivel)
		this.desired.swivel = swivel
		this.enforced.swivel = swivel
		this.smoothed.swivel = swivel
	}

	pivotInstantly(pivot: Coordinates) {
		this.desired.pivot.set(pivot)
		this.enforced.pivot.set(pivot)
		this.smoothed.pivot.set(pivot)
		this.#updateCamera()
	}

	tick(seconds: number) {
		this.#applyDesireConstraints()
		this.#updateEnforced()
		this.#updateSmoothed(seconds)
		this.#updateCamera()
		this.#updateSpotlight()
	}

	#applyDesireConstraints() {
		this.desired.tilt = Scalar.clamp(
			this.desired.tilt,
			...constants.camera.tiltBounds.array(),
		)
		this.desired.distance = Scalar.clamp(
			this.desired.distance,
			...constants.camera.distanceBounds.array(),
		)
	}

	#updateEnforced() {
		this.enforced = this.desired.clone()
		this.enforced.swivel = Circular.normalize(
			constants.camera.swivelSnappingIncrements === 0
				? this.enforced.swivel
				: Math.round(
					this.enforced.swivel / constants.camera.swivelSnappingIncrements
				) * constants.camera.swivelSnappingIncrements
		)
	}

	#updateSmoothed(seconds: number) {
		const {sharpness} = this
		this.smoothed.pivot.approach(this.enforced.pivot, sharpness, seconds)
		this.smoothed.swivel = Circular.approach(this.smoothed.swivel, this.enforced.swivel, sharpness, seconds)
		this.smoothed.tilt = Scalar.approach(this.smoothed.tilt, this.enforced.tilt, sharpness, seconds)
		this.smoothed.distance = Scalar.approach(this.smoothed.distance, this.enforced.distance, sharpness, seconds)
	}

	#updateCamera() {
		const target = this.smoothed.pivot.position()
			.add_(0,  constants.camera.pivotHeight, 0)
		this.camera.target.set(...target.array())
		this.camera.alpha = alphaReset - this.smoothed.swivel
		this.camera.beta = this.smoothed.tilt
		this.camera.radius = this.smoothed.distance
	}

	#updateSpotlight() {
		const targetPosition = this.smoothed.pivot.position()
		const cameraPosition = Vec3.from(this.camera.position.asArray())
		const cameraLookingVector = targetPosition.clone().subtract(cameraPosition)
		const cameraNormal = cameraLookingVector.clone().normalize()
		this.lighting.spot.position.set(...cameraPosition.array())
		this.lighting.spot.direction.set(...cameraNormal.array())
	}
}

