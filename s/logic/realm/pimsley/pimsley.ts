
import {Circular, Degrees, Quat, Scalar, Vec2, Vec3} from "@benev/toolbox"

import {DrunkSway} from "./utils/drunk-sway.js"
import {constants} from "../../../constants.js"
import {Coordinates} from "../utils/coordinates.js"
import {PimsleyAnims} from "./utils/pimsley-anims.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"
import {Anglemeter} from "../../entities/crusader/utils/anglemeter.js"
import {Speedometer} from "../../entities/crusader/utils/speedometer.js"

const {crusader, sim: {deltaTime}} = constants
const rotationOffset = Degrees.toRadians(180)

export class Pimsley {
	pallet: Pallet

	rotation: Circular
	coordinates: Coordinates
	displayRotation: Circular

	anims: PimsleyAnims
	anglemeter: Anglemeter
	speedometer: Speedometer

	drunkSway = new DrunkSway()
	turnCap = new Scalar(Degrees.toRadians(240))

	constructor(public options: {
			pallet: Pallet
			rotation: Circular
			coordinates: Coordinates
		}) {

		this.pallet = options.pallet

		this.rotation = options.rotation.clone()
		this.coordinates = options.coordinates.clone()
		this.displayRotation = this.rotation.clone()

		this.anims = new PimsleyAnims(options.pallet)
		this.anglemeter = new Anglemeter(this.rotation)
		this.speedometer = new Speedometer(this.coordinates)
	}

	update(tick: number) {
		const {options, coordinates, rotation} = this

		coordinates.lerp(options.coordinates, crusader.sharpness)
		const absoluteMovement = this.speedometer.measure(deltaTime)
		const moveSpeed = absoluteMovement.magnitude()

		const turnCap = this.#getTurnCap(moveSpeed)
		rotation.lerp(options.rotation, 0.4, turnCap * deltaTime)
		const spin = this.anglemeter.measure(deltaTime)
		const sway = this.#getRotationalSway(tick, moveSpeed)

		const displayRotation = this.displayRotation
			.set(rotationOffset + rotation.x + sway).x

		const movement = absoluteMovement.rotate(-displayRotation)

		this.anims.amble.animate(tick, movement, spin)

		this.pallet.applySpatial({
			position: coordinates.position(),
			rotation: Quat.rotate_(0, displayRotation, 0),
		})
	}

	/** radians per second */
	#getTurnCap(moveSpeed: number) {
		const {speedSprint, turnCap: {sharpness, standstill, fullsprint}} = crusader
		const target = Scalar.remap(
			moveSpeed,
			0, speedSprint,
			standstill, fullsprint,
			true,
		)
		return this.turnCap.lerp(target, sharpness).x
	}

	#getRotationalSway(tick: number, moveSpeed: number) {
		const factor = Scalar.remap(
			moveSpeed,
			0, crusader.speedSprint,
			0, 1,
			true,
		)
		return factor * this.drunkSway.update(tick) * crusader.sprintSway
	}
}

