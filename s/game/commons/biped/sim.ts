
import {Circular, Degrees, Scalar, Vec2} from "@benev/toolbox"

import {Mortal} from "../mortal/registry.js"
import {Station} from "../../station/station.js"
import {Zen} from "../../../tools/hash/zen-grid.js"
import {PhysBody} from "../../physics/parts/body.js"
import {AttackZoneSim} from "./utils/attack-zone.js"
import {Circle} from "../../physics/shapes/circle.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {BipedActivity, BipedOptions, BipedState} from "./types.js"

export class BipedSim {
	mortal: Mortal

	coordinates: Coordinates
	circle: Circle
	slowRotation: Circular
	body: PhysBody
	entityZen: Zen<number>
	mortalZen: Zen<Mortal>
	attackZone: AttackZoneSim

	activity: BipedActivity = {
		block: 0,
		attack: false,
		sprint: false,
		rotation: 0,
		movementIntent: new Vec2(0, 0),
	}

	get phys() {
		return this.station.dungeon.phys
	}

	constructor(
			public id: number,
			public station: Station,
			public getState: () => BipedState,
			public options: BipedOptions,
		) {

		this.coordinates = Coordinates.from(getState().coordinates)
		this.circle = new Circle(this.coordinates, options.radius)
		this.slowRotation = new Circular(getState().rotation)
		this.mortal = new Mortal(this.circle)

		const bounds = this.circle.boundingBox()
		this.entityZen = station.entityHashgrid.create(bounds, id)
		this.mortalZen = station.mortals.create(bounds, this.mortal)

		this.body = station.dungeon.phys.makeBody({
			parts: [{shape: this.circle, mass: 80}],
			updated: (body) => {
				this.coordinates.set(body.box.center)
				const state = getState()
				state.coordinates = this.coordinates.array()
				bounds.center.set(this.coordinates)
				// this.entityZen.box.center.set(this.coordinates)
				// this.mortalZen.box.center.set(this.coordinates)
				this.entityZen.update()
				this.mortalZen.update()
			},
		})

		this.attackZone = new AttackZoneSim()
	}

	wake() {
		this.phys.wakeup(this.body)
	}

	simulate(tick: number) {
		const state = this.getState()
		const {activity, options} = this
		const {walkSpeed, sprintSpeed, attackingSpeedMultiplier, omnidirectionalSprint} = this.options.movement

		state.health = this.mortal.health.value

		const speedLimit = state.attack
			? walkSpeed * attackingSpeedMultiplier
			: sprintSpeed * attackingSpeedMultiplier

		const movementIntent = Coordinates.from(activity.movementIntent)
		const newVelocity = movementIntent
			.clampMagnitude(1)
			.multiplyBy(sprintSpeed)
			.clampMagnitude(speedLimit)

		const halfwayBetweenWalkAndSprint = Scalar.lerp(walkSpeed, sprintSpeed, 0.5)

		const sprintingDetected = omnidirectionalSprint
			? false
			: newVelocity.magnitude() > halfwayBetweenWalkAndSprint

		this.body.box.center.set_(...state.coordinates)
		this.body.velocity.set(newVelocity)

		state.rotation = Circular.normalize(
			(sprintingDetected && !movementIntent.equals_(0, 0))
				? movementIntent.rotation() + Degrees.toRadians(90)
				: activity.rotation
		)

		this.slowRotation.approach(state.rotation, 10, this.station.seconds, this.options.combat.turnCap)

		state.block = activity.block

		if (state.attack && tick >= state.attack.expiresAtTick)
			state.attack = null

		if (activity.attack && !state.attack) {
			state.attack = {expiresAtTick: tick + 76, rotation: activity.rotation}
			if (options.combat.turnCapEnabled)
				this.slowRotation.x = activity.rotation
		}

		const combative = !!(state.attack || state.block > 0.1)

		if (options.combat.turnCapEnabled && combative)
			state.rotation = this.slowRotation.x

		this.attackZone.update(this.coordinates, this.slowRotation)
	}

	dispose() {
		this.body.dispose()
		this.entityZen.delete()
	}
}

