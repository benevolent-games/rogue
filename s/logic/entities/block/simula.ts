
import {Vec2, Vec3} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Box2} from "../../physics/shapes/box2.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

const density = 100

export const blockSimula = simula<RogueEntities, Station>()<"block">(
	({station, state, getState}) => {

	const coordinates = Coordinates.from(state.coordinates)
	const dimensions = Vec3.from(state.dimensions)

	const body = station.dungeon.phys.makeBody({
		parts: [{
			mass: density * (dimensions.x * dimensions.y * dimensions.z),
			shape: new Box2(
				coordinates,
				new Vec2(dimensions.x, dimensions.z),
			),
		}],
		updated: body => {
			getState().coordinates = body.box.center.array()
		},
	})

	return {
		simulate: (_tick, state) => {
			body.box.center.set_(...state.coordinates)
		},
		dispose: () => {
			body.dispose()
		},
	}
})

