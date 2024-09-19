
import {Vec2} from "@benev/toolbox"

export const cardinals: Vec2[] = [
	Vec2.new(0, 1), // north
	Vec2.new(1, 0), // east
	Vec2.new(0, -1), // south
	Vec2.new(-1, 0), // west
]

export const ordinals: Vec2[] = [
	Vec2.new(1, 1), // north-east
	Vec2.new(1, -1), // south-east
	Vec2.new(-1, -1), // south-west
	Vec2.new(-1, 1), // north-west
]

