
import {Circular, Degrees, Quat, Scalar} from "@benev/toolbox"

import {DrunkSway} from "./utils/drunk-sway.js"
import {constants} from "../../../constants.js"
import {Coordinates} from "../utils/coordinates.js"
import {PimsleyAnims} from "./utils/pimsley-anims.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"
import {Anglemeter} from "../../entities/crusader/utils/anglemeter.js"
import {Speedometer} from "../../entities/crusader/utils/speedometer.js"

const {crusader} = constants
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

	update(tick: number, seconds: number) {
		const {options, coordinates, rotation} = this

		coordinates.approach(options.coordinates, crusader.sharpness, seconds)
		const absoluteMovement = this.speedometer.measure(seconds)
		const moveSpeed = absoluteMovement.magnitude()

		const turnCap = this.#getTurnCap(seconds, moveSpeed)
		rotation.approach(options.rotation, 10, seconds, turnCap)
		const spin = this.anglemeter.measure(seconds)
		const sway = this.#getRotationalSway(tick, seconds, moveSpeed)

		const displayRotation = this.displayRotation
			.set(rotationOffset + rotation.x + sway).x

		const movement = absoluteMovement.rotate(-displayRotation)

		this.anims.amble.animate(tick, seconds, movement, spin)

		this.pallet.applySpatial({
			position: coordinates.position(),
			rotation: Quat.rotate_(0, displayRotation, 0),
		})
	}

	/** radians per second */
	#getTurnCap(seconds: number, moveSpeed: number) {
		const {speedSprint, turnCap: {adaptationSharpness, standstill, fullsprint}} = crusader
		const target = Scalar.remap(
			moveSpeed,
			0, speedSprint,
			standstill, fullsprint,
			true,
		)
		return this.turnCap.approach(target, adaptationSharpness, seconds).x
	}

	#getRotationalSway(tick: number, seconds: number, moveSpeed: number) {
		const factor = Scalar.remap(
			moveSpeed,
			0, crusader.speedSprint,
			0, 1,
			true,
		)
		return factor * this.drunkSway.update(tick, seconds) * crusader.sprintSway
	}
}

