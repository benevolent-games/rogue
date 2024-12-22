
import {Vec2, Vec2Array} from "@benev/toolbox"
import {Coordinates} from "../../realm/utils/coordinates.js"

export type BlockState = {
	coordinates: Vec2Array
	dimensions: Vec2Array
	height: number
}

export function readBlock(state: BlockState) {
	return {
		height: state.height,
		dimensions: Vec2.from(state.dimensions),
		coordinates: Coordinates.from(state.coordinates),
	}
}

