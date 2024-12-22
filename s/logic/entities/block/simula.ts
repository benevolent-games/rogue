
import {Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {PhysBody} from "../../physics/phys.js"
import {Station} from "../../station/station.js"
import {Box2} from "../../physics/shapes/box2.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

const density = 1

export const blockSimula = simula<RogueEntities, Station>()<"block">(
	({station, state, getState}) => {

	const coordinates = Coordinates.from(state.coordinates)
	const dimensions = Vec2.from(state.dimensions)
	const height = state.height

	const physBody = new PhysBody(
		new Box2(
			coordinates,
			Vec2.from(dimensions)
		),
		density * (dimensions.x * dimensions.y * height),
		body => getState().coordinates = body.shape.center.array(),
	)

	const disposePhysBody = station.phys.addBody(physBody)

	return {
		simulate: () => {},
		dispose: () => {
			disposePhysBody()
		},
	}
})

