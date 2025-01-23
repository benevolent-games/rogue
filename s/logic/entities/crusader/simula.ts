
import {Degrees, Vec2, Circular, Scalar} from "@benev/toolbox"

import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {Circle} from "../../physics/shapes/circle.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

const {crusader} = constants
const {walkSpeed, sprintSpeed} = crusader.movement

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({id, station, state, getState, fromAuthor}) => {

	const {phys} = station.dungeon

	let data: RogueEntities["crusader"]["input"] = {
		attack: false,
		block: 0,
		sprint: false,
		movementIntent: Vec2.zero().array(),
		rotation: 0,
	}

	const circle = new Circle(
		Vec2.from(state.coordinates),
		constants.crusader.radius,
	)

	const entityZen = station.entityHashgrid.create(circle.boundingBox(), id)

	const body = phys.makeBody({
		parts: [{shape: circle, mass: 80}],
		updated: body => {
			const coordinates = Coordinates.from(body.box.center)
			getState().coordinates = coordinates.array()
			entityZen.box.center.set(coordinates)
			entityZen.update()
			station.updateAuthorCoordinates(state.author, coordinates)
		},
	})

	const slowRotation = new Circular(state.rotation)

	return {
		simulate: (tick, state, inputs) => {
			data = fromAuthor(state.author, inputs).at(-1) ?? data

			const speedLimit = state.attack
				? walkSpeed * crusader.movement.attackingSpeedMultiplier
				: sprintSpeed * crusader.movement.attackingSpeedMultiplier

			const movementIntent = Coordinates.from(data.movementIntent)
			const newVelocity = movementIntent
				.clampMagnitude(1)
				.multiplyBy(sprintSpeed)
				.clampMagnitude(speedLimit)

			const halfwayBetweenWalkAndSprint = Scalar.lerp(walkSpeed, sprintSpeed, 0.5)

			const sprintingDetected = crusader.movement.omnidirectionalSprint
				? false
				: newVelocity.magnitude() > halfwayBetweenWalkAndSprint

			body.box.center.set_(...state.coordinates)
			body.velocity.set(newVelocity)
			phys.wakeup(body)

			state.rotation = Circular.normalize(
				(sprintingDetected && !movementIntent.equals_(0, 0))
					? movementIntent.rotation() + Degrees.toRadians(90)
					: data.rotation
			)

			state.block = data.block

			if (state.attack && tick >= state.attack.expiresAtTick)
				state.attack = null

			if (data.attack && !state.attack) {
				state.attack = {expiresAtTick: tick + 76, rotation: data.rotation}
				if (crusader.combat.attackTurnCapEnabled)
					slowRotation.x = data.rotation
			}

			if (crusader.combat.attackTurnCapEnabled && state.attack) {
				slowRotation.approach(data.rotation, 10, station.seconds, crusader.combat.attackTurnCap)
				state.rotation = slowRotation.x
			}
		},
		dispose: () => {
			body.dispose()
			entityZen.delete()
		},
	}
})

