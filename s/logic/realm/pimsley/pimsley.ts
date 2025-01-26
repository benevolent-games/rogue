
import {Circular, Degrees, Quat, Scalar} from "@benev/toolbox"

import {GraceTracker} from "./utils/grace.js"
import {DrunkSway} from "./utils/drunk-sway.js"
import {constants} from "../../../constants.js"
import {Coordinates} from "../utils/coordinates.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"
import {getMeshoids} from "../../../tools/babylon/babylon-helpers.js"
import {PimsleyChoreographer} from "./utils/pimsley-choreographer.js"
import {Anglemeter} from "../../entities/crusader/utils/anglemeter.js"
import {Speedometer} from "../../entities/crusader/utils/speedometer.js"

const {crusader} = constants
const rotationOffset = Degrees.toRadians(180)

export type PimsleyCharacteristics = {
	block: number
	attack: boolean
	rotation: Circular
	coordinates: Coordinates
}

export class Pimsley {
	block = 0
	attack = false
	rotation = new Circular(0)
	coordinates = Coordinates.zero()
	displayRotation = new Circular(0)

	anglemeter = new Anglemeter(this.rotation)
	speedometer = new Speedometer(this.coordinates)

	drunkSway = new DrunkSway()
	graceTracker = new GraceTracker()

	choreographer: PimsleyChoreographer

	constructor(public pallet: Pallet) {
		this.choreographer = new PimsleyChoreographer(pallet)
	}

	freeze() {
		this.choreographer.freeze()
	}

	unfreeze() {
		this.choreographer.unfreeze()
	}

	applyMaterial(material: Material) {
		for (const cargo of this.pallet.warehouse) {
			for (const [,mesh] of getMeshoids(cargo.prop)) {
				mesh.material = material
			}
		}
	}

	init(characteristics: PimsleyCharacteristics) {
		this.rotation = characteristics.rotation.clone()
		this.displayRotation = characteristics.rotation.clone()
		this.coordinates = characteristics.coordinates.clone()
		this.attack = characteristics.attack
		this.block = characteristics.block
		this.anglemeter.reset(this.rotation)
		this.speedometer.reset(this.coordinates)
	}

	update({tick, seconds, ...characteristics}: {
			tick: number,
			seconds: number,
		} & PimsleyCharacteristics) {

		const {coordinates, rotation} = this

		coordinates.approach(characteristics.coordinates, crusader.anim.movementSharpness, seconds)
		const absoluteMovement = this.speedometer.measure(seconds)
		const moveSpeed = absoluteMovement.magnitude()
		const grace = this.graceTracker.update(moveSpeed, seconds)

		rotation.approach(characteristics.rotation, grace.turnSharpness, seconds, grace.turnCap)
		const spin = this.anglemeter.measure(seconds)
		const sway = this.#getRotationalSway(tick, seconds, moveSpeed)
		const rotationDiscrepancy = characteristics.rotation.difference(rotation)

		const displayRotation = this.displayRotation
			.set(rotationOffset + rotation.x + sway).x

		const movement = absoluteMovement.rotate(-displayRotation)

		this.choreographer.animate({
			tick,
			seconds,
			movement,
			spin,
			grace,
			block: characteristics.block,
			attack: characteristics.attack,
			rotationDiscrepancy,
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

