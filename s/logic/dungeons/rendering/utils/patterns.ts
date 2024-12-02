
import {Degrees, loop, Radians, Vec2} from "@benev/toolbox"
import {Vecset2} from "../../utils/vecset2.js"
import {cardinals, ordinals} from "../../../../tools/directions.js"

// a b c
// d $ e
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

export const getConcaveStumps = (() => {

	// a X X
	// - $ X
	// - - b
	const pattern = [
		ordinals[3],
		ordinals[1],
		Vec2.new(-0.25, 0),
		Vec2.new(0, -0.25),
	]

	const patterns = [...ordinals.keys()].map(index =>
		pattern.map(vector =>
			vector.clone().rotate(Degrees.toRadians(-90 * index))
		)
	)

	return (location: Vec2, ordinalIndex: number, walkables: Vecset2) => {
		const [a, b, u, v] = patterns.at(ordinalIndex)!
			.map(tile => location.clone().add(tile))
		const left = walkables.has(a)
			? null
			: u
		const right = walkables.has(b)
			? null
			: v
		return {left, right}
	}
})()

export const getConvexStumps = (() => {

	// - a -
	// - X b
	// $ - -
	const pattern = [
		new Vec2(1, 2),
		new Vec2(2, 1),
		ordinals[0].clone().add_(-1, 0.25),
		ordinals[0].clone().add_(0.25, -1),
	]

	const patterns = [...ordinals.keys()].map(index =>
		pattern.map(vector =>
			vector.clone().rotate(Degrees.toRadians(-90 * index))
		)
	)

	return (location: Vec2, ordinalIndex: number, walkables: Vecset2) => {
		const [a, b, u, v] = patterns.at(ordinalIndex)!
			.map(tile => location.clone().add(tile))
		const left = walkables.has(a)
			? null
			: u
		const right = walkables.has(b)
			? null
			: v
		return {left, right}
	}
})()

//////////////////////////////

export const getWallSkinningReport = (() => {

	//   i j k
	// h a e l
	// d X b m
	// g c f
	const northPattern = [
		...cardinals,
		...ordinals,
		Vec2.new(0, 2),
		Vec2.new(1, 2),
		Vec2.new(2, 2),
		Vec2.new(2, 1),
		Vec2.new(2, 0),
	]

	type Placement = {offset: Vec2, radians: number}

	return (unwalkable: Vec2, walkables: Vecset2) => {
		const considerOneSide = (pattern: Vec2[], radians: number) => {
			const [a, b, c, d, e, f, g, h, i, j, k, l, m] = pattern.map(p => p.clone().rotate(radians).round())
			const isWalkable = (tile: Vec2) => walkables.has(unwalkable.clone().add(tile))
			const notWalkable = (tile: Vec2) => !walkables.has(unwalkable.clone().add(tile))

			let wall: Placement | null = null
			let concave: Placement | null = null
			let convex: Placement | null = null
			const stumps: Placement[] = []

			// wall
			if ([h, a, e].every(isWalkable) && [d, b].every(notWalkable)) {
				wall = {
					offset: new Vec2(0, 0.5).rotate(radians),
					radians,
				}
			}

			// concave
			else if ([a, b].every(notWalkable) && isWalkable(e)) {
				concave = {
					offset: new Vec2(0.5, 0.5).rotate(radians),
					radians: Degrees.toRadians(-90) + radians,
				}

				// left stump
				if (notWalkable(i) && isWalkable(j)) {
					stumps.push({
						offset: new Vec2(0.5, 1.25).rotate(radians),
						radians: Degrees.toRadians(-90) + radians,
					})
				}

				// right stump
				if (notWalkable(m) && isWalkable(l)) {
					stumps.push({
						offset: new Vec2(1.25, 0.5).rotate(radians),
						radians: Degrees.toRadians(0) + radians,
					})
				}
			}

			// convex
			else if ([a, e, b].every(isWalkable)) {
				convex = {
					offset: new Vec2(0.5, 0.5).rotate(radians),
					radians: Degrees.toRadians(-90) + radians,
				}

				// left stump
				if (notWalkable(c) && isWalkable(f)) {
					stumps.push({
						offset: new Vec2(0.5, -0.25).rotate(radians),
						radians: Degrees.toRadians(-90) + radians,
					})
				}

				// right stump
				if (notWalkable(d) && isWalkable(h)) {
					stumps.push({
						offset: new Vec2(-0.25, 0.5).rotate(radians),
						radians: Degrees.toRadians(0) + radians,
					})
				}
			}

			return {wall, concave, convex, stumps}
		}

		return [...loop(4)].map(index =>
			considerOneSide(northPattern, Degrees.toRadians(-90 * index))
		)
	}
})()

