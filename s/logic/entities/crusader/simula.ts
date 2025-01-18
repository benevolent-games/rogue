
import {Degrees, Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {Circle} from "../../physics/shapes/circle.js"
import {Circular} from "../../../tools/temp/circular.js"
import {rotation} from "../../../tools/temp/rotation.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({id, station, state, getState, fromAuthor}) => {

	const {phys} = station.dungeon

	let data: RogueEntities["crusader"]["input"] = {
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

	return {
		simulate: (_tick, state, inputs) => {
			data = fromAuthor(state.author, inputs).at(-1) ?? data

			const speed = state.speed
			const speedSprint = state.speedSprint

			const movementIntent = Coordinates.from(data.movementIntent)
			const newVelocity = movementIntent
				.clampMagnitude(1)
				.multiplyBy(speedSprint)

			const sprintingDetected = newVelocity.magnitude() > speed

			body.box.center.set_(...state.coordinates)
			body.velocity.set(newVelocity)
			phys.wakeup(body)

			state.rotation = Circular.normalize(
				(sprintingDetected && !movementIntent.equals_(0, 0))
					? rotation(movementIntent) + Degrees.toRadians(90)
					: data.rotation
			)
		},
		dispose: () => {
			body.dispose()
			entityZen.delete()
		},
	}
})

