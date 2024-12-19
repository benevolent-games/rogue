
import {FloorSegment} from "./types.js"
import {Vec2, Vec2Array} from "@benev/toolbox"

export const size1 = new Vec2(1, 1)

export const hashFloor = ({style, size, tile}: FloorSegment) => [
	style.name,
	size.x,
	size.y,
	tile.x,
	tile.y,
].join(",")

export function decodeSizeString(string: string) {
	return Vec2.from(
		string
			.split("x")
			.map(x => parseInt(x)) as Vec2Array
	)
}

export function encodeSizeString({x, y}: Vec2) {
	return `${x}x${y}`
}

