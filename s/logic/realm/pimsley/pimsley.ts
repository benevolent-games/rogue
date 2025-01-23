
import {Ref} from "@benev/slate"
import {Circular, Degrees, Quat, Scalar} from "@benev/toolbox"

import {GraceTracker} from "./utils/grace.js"
import {DrunkSway} from "./utils/drunk-sway.js"
import {constants} from "../../../constants.js"
import {Coordinates} from "../utils/coordinates.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"
import {PimsleyChoreographer} from "./utils/pimsley-choreographer.js"
import {Anglemeter} from "../../entities/crusader/utils/anglemeter.js"
import {Speedometer} from "../../entities/crusader/utils/speedometer.js"

const {crusader} = constants
const rotationOffset = Degrees.toRadians(180)

export class Pimsley {
	pallet: Pallet

	rotation: Circular
	coordinates: Coordinates
	displayRotation: Circular
	attack: Ref<boolean>
	block: Ref<boolean>

	anims: PimsleyChoreographer
	anglemeter: Anglemeter
	speedometer: Speedometer

	graceTracker = new GraceTracker()
	drunkSway = new DrunkSway()
	// turnCap = new Scalar(Degrees.toRadians(240))

	constructor(public options: {
			pallet: Pallet
			rotation: Circular
			coordinates: Coordinates
			attack: Ref<boolean>
			block: Ref<boolean>
		}) {

		this.pallet = options.pallet

		this.rotation = options.rotation.clone()
		this.coordinates = options.coordinates.clone()
		this.displayRotation = this.rotation.clone()
		this.attack = options.attack
		this.block = options.block

		this.anims = new PimsleyChoreographer(options.pallet)
		this.anglemeter = new Anglemeter(this.rotation)
		this.speedometer = new Speedometer(this.coordinates)
	}

	update(tick: number, seconds: number) {
		const {options, coordinates, rotation, attack, block} = this

		coordinates.approach(options.coordinates, crusader.anim.movementSharpness, seconds)
		const absoluteMovement = this.speedometer.measure(seconds)
		const moveSpeed = absoluteMovement.magnitude()
		const grace = this.graceTracker.update(moveSpeed, seconds)

		// const turnCap = this.#getTurnCap(seconds, moveSpeed)
		rotation.approach(options.rotation, grace.turnSharpness, seconds, grace.turnCap)
		const spin = this.anglemeter.measure(seconds)
		const sway = this.#getRotationalSway(tick, seconds, moveSpeed)

		const displayRotation = this.displayRotation
			.set(rotationOffset + rotation.x + sway).x

		const movement = absoluteMovement.rotate(-displayRotation)

		this.anims.animate({
			tick,
			seconds,
			movement,
			spin,
			grace,
			attack: attack.value,
			block: block.value,
		})

		this.pallet.applySpatial({
			position: coordinates.position(),
			rotation: Quat.rotate_(0, displayRotation, 0),
		})
	}

	#getRotationalSway(tick: number, seconds: number, moveSpeed: number) {
		const factor = Scalar.remap(
			moveSpeed,
			0, crusader.movement.sprintSpeed,
			0, 1,
			true,
		)
		return factor * this.drunkSway.update(tick, seconds) * crusader.anim.sprintSway
	}
}

