
import {Degrees, Scalar, Vec2, Vec3} from "@benev/toolbox"

import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

import {Lighting} from "./lighting.js"
import {Coordinates} from "./coordinates.js"

const pivotHeight = 1.6
const alphaReset = Degrees.toRadians(-90)
const tiltBounds = new Vec2(Degrees.toRadians(0.1), Degrees.toRadians(60))
const distanceBounds = new Vec2(6, 25)
const swivelSnappingIncrements = Degrees.toRadians(45)

export class CameramanState {
	pivot = new Coordinates(0, 0)
	swivel = Degrees.toRadians(45)
	tilt = Degrees.toRadians(20)
	distance = (distanceBounds.x + distanceBounds.y) * (1 / 4)

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

	lerp = 10 / 100

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
		const swivel = this.smoothed.swivel % Degrees.toRadians(360)
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

	tick() {
		this.#applyDesireConstraints()
		this.#updateEnforced()
		this.#updateSmoothed()
		this.#updateCamera()
		this.#updateSpotlight()
	}

	#applyDesireConstraints() {
		this.desired.tilt = Scalar.clamp(this.desired.tilt, ...tiltBounds.array())
		this.desired.distance = Scalar.clamp(this.desired.distance, ...distanceBounds.array())
	}

	#updateEnforced() {
		this.enforced = this.desired.clone()
		this.enforced.swivel = Math.round(this.enforced.swivel / swivelSnappingIncrements) * swivelSnappingIncrements
	}

	#updateSmoothed() {
		const {lerp} = this
		this.smoothed.pivot.lerp(this.enforced.pivot, lerp)
		this.smoothed.swivel = Scalar.lerp(this.smoothed.swivel, this.enforced.swivel, lerp)
		this.smoothed.tilt = Scalar.lerp(this.smoothed.tilt, this.enforced.tilt, lerp)
		this.smoothed.distance = Scalar.lerp(this.smoothed.distance, this.enforced.distance, lerp)
	}

	#updateCamera() {
		const target = this.smoothed.pivot.position().add_(0,  pivotHeight, 0)
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

