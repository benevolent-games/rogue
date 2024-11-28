
import {Vec2} from "@benev/toolbox"

export const cardinals = Object.freeze([
	Vec2.new(0, 1), // north
	Vec2.new(1, 0), // east
	Vec2.new(0, -1), // south
	Vec2.new(-1, 0), // west
]) as Vec2[]

export const ordinals = Object.freeze([
	Vec2.new(1, 1), // north-east
	Vec2.new(1, -1), // south-east
	Vec2.new(-1, -1), // south-west
	Vec2.new(-1, 1), // north-west
]) as Vec2[]

