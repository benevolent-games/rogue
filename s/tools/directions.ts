
import {Vec2} from "@benev/toolbox"

export const cardinals: Vec2[] = [
	[0, 1], // north
	[1, 0], // east
	[0, -1], // south
	[-1, 0], // west
]

export const ordinals: Vec2[] = [
	[1, 1], // north-east
	[1, -1], // south-east
	[-1, -1], // south-west
	[-1, 1], // north-west
]

