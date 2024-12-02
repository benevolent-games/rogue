
import {Degrees, loop, Vec2} from "@benev/toolbox"

import {Placement} from "./types.js"
import {Vecset2} from "../../utils/vecset2.js"
import {cardinals, ordinals} from "../../../../tools/directions.js"

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

export function planWallSkinning(unwalkable: Vec2, walkables: Vecset2) {
	const considerOneSide = (pattern: Vec2[], radians: number) => {
		const [a, b, c, d, e, f, g, h, i, j, k, l, m] = pattern.map(p => p.clone().rotate(radians).round())
		const isWalkable = (tile: Vec2) => walkables.has(unwalkable.clone().add(tile))
		const notWalkable = (tile: Vec2) => !walkables.has(unwalkable.clone().add(tile))

		let wall: Placement | null = null
		let concave: Placement | null = null
		let convex: Placement | null = null
		const stumps: Placement[] = []

		const finalizePlacement = (
			(draft: {offset: Vec2, radians: number}): Placement => ({
				radians: draft.radians + radians,
				location: unwalkable.clone().add(draft.offset.rotate(radians)),
			})
		)

		// wall
		if ([h, a, e].every(isWalkable) && [d, b].every(notWalkable)) {
			wall = finalizePlacement({
				offset: new Vec2(0, 0.5),
				radians: 0,
			})
		}

		// concave
		else if ([a, b].every(notWalkable) && isWalkable(e)) {
			concave = finalizePlacement({
				offset: new Vec2(0.5, 0.5),
				radians: Degrees.toRadians(-90),
			})

			// left stump
			if (notWalkable(i) && isWalkable(j)) {
				stumps.push(finalizePlacement({
					offset: new Vec2(0.5, 1.25),
					radians: Degrees.toRadians(-90),
				}))
			}

			// right stump
			if (notWalkable(m) && isWalkable(l)) {
				stumps.push(finalizePlacement({
					offset: new Vec2(1.25, 0.5),
					radians: Degrees.toRadians(0),
				}))
			}
		}

		// convex
		else if ([a, e, b].every(isWalkable)) {
			convex = finalizePlacement({
				offset: new Vec2(0.5, 0.5),
				radians: Degrees.toRadians(-90),
			})

			// left stump
			if (notWalkable(c) && isWalkable(f)) {
				stumps.push(finalizePlacement({
					offset: new Vec2(0.5, -0.25),
					radians: Degrees.toRadians(-90),
				}))
			}

			// right stump
			if (notWalkable(d) && isWalkable(h)) {
				stumps.push(finalizePlacement({
					offset: new Vec2(-0.25, 0.5),
					radians: Degrees.toRadians(0),
				}))
			}
		}

		return {wall, concave, convex, stumps}
	}

	return [...loop(4)].map(index =>
		considerOneSide(northPattern, Degrees.toRadians(-90 * index))
	)
}

