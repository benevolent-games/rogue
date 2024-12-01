
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

export const corners = Object.freeze([
	[cardinals[0], ordinals[0], cardinals[1]], // north-east
	[cardinals[1], ordinals[1], cardinals[2]], // south-east
	[cardinals[2], ordinals[2], cardinals[3]], // south-west
	[cardinals[3], ordinals[3], cardinals[0]], // north-west
]) as [Vec2, Vec2, Vec2][]

