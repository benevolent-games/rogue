
import {Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {PhysBody} from "../../physics/phys.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {simula} from "../../../archimedes/exports.js"
import {Circle} from "../../physics/shapes/circle.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({station, state, fromAuthor}) => {

	let data: RogueEntities["crusader"]["input"] = {
		sprint: false,
		movementIntent: Vec2.zero().array(),
	}

	const circle = new Circle(
		Vec2.from(state.coordinates),
		constants.game.crusader.radius,
	)

	const physBody = station.phys.addBody(
		new PhysBody(circle, 80)
	)

	return {
		simulate: (_tick, state, inputs) => {
			data = fromAuthor(state.author, inputs).at(-1) ?? data

			const speed = state.speed
			const speedSprint = state.speedSprint

			const sprint = data.sprint
			const movementIntent = Coordinates.from(data.movementIntent)
			const energyDelta = movementIntent
				.clampMagnitude(1)
				.multiplyBy(sprint ? speedSprint : speed)

			circle.center.set_(...state.coordinates)
			physBody.energy.add(energyDelta.multiplyBy(20))
			station.phys.simulateBody(physBody)

			state.coordinates = circle.center.array()
		},
		dispose: () => {},
	}
})

