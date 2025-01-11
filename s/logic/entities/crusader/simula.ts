
import {Degrees, Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {Circle} from "../../physics/shapes/circle.js"
import {Vec2Fns} from "../../../tools/temp/vec2-fns.js"
import {Circular} from "../../../tools/temp/circular.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({station, state, getState, fromAuthor}) => {

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

	const body = phys.makeBody({
		parts: [{shape: circle, mass: 80}],
		updated: body => {
			getState().coordinates = body.box.center.array()
		},
	})

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

			body.box.center.set_(...state.coordinates)
			body.velocity.set(energyDelta)
			phys.wakeup(body)

			state.rotation = Circular.normalize(
				(sprint && !movementIntent.equals_(0, 0))
					? Vec2Fns.asRotation(movementIntent) + Degrees.toRadians(180)
					: data.rotation
			)
		},
		dispose: () => {
			body.dispose()
		},
	}
})

