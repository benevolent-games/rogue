
import {Vec2Array, Vec3, Vec3Array} from "@benev/toolbox"
import {Coordinates} from "../../realm/utils/coordinates.js"

export type BlockState = {
	coordinates: Vec2Array
	dimensions: Vec3Array
}

export function readBlock(state: BlockState) {
	return {
		dimensions: Vec3.from(state.dimensions),
		coordinates: Coordinates.from(state.coordinates),
	}
}

