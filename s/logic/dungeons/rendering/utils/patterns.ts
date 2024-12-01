
import {Vec2} from "@benev/toolbox"
import {Vecset2} from "../../utils/vecset2.js"
import { cardinals, ordinals } from "../../../../tools/directions.js"

// a b c
// d - e
const wallConsiderations = Object.freeze([
	[ordinals[3], cardinals[0], ordinals[0], cardinals[3], cardinals[1]],
	[ordinals[0], cardinals[1], ordinals[1], cardinals[0], cardinals[2]],
	[ordinals[1], cardinals[2], ordinals[2], cardinals[1], cardinals[3]],
	[ordinals[2], cardinals[3], ordinals[3], cardinals[2], cardinals[0]],
]) as [Vec2, Vec2, Vec2, Vec2, Vec2][]

export function isWall(location: Vec2, cardinalIndex: number, walkables: Vecset2) {
	const [a, b, c, d, e] = wallConsiderations.at(cardinalIndex)!
		.map(tile => location.clone().add(tile))

	const sideMatches = [a, b, c].every(tile => !walkables.has(tile))
	const besideCorner = sideMatches && [d, e].some(tile => !walkables.has(tile))

	return sideMatches && !besideCorner
}

export function isConcave(location: Vec2, corner: [Vec2, Vec2, Vec2], walkables: Vecset2) {
	return corner
		.map(c => location.clone().add(c))
		.every(c => !walkables.has(c))
}

export function isConvex(location: Vec2, corner: [Vec2, Vec2, Vec2], walkables: Vecset2) {
	const [left, middle, right] = corner
		.map(c => location.clone().add(c))
	return (
		walkables.has(left) &&
		!walkables.has(middle) &&
		walkables.has(right)
	)
}

