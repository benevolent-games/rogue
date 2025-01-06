
import {Degrees, loop, Vec2} from "@benev/toolbox"

import {Vecset2} from "./vecset2.js"
import {range} from "../../../tools/range.js"

// b c -
// a @ -
// - - -
const northEastCorner = [
	Vec2.new(-1, 0), // a
	Vec2.new(-1, 1), // b
	Vec2.new(0, 1), // c
]

const fourCornerPatterns = range(4).map(i => northEastCorner.map(
	tile => tile.clone()
		.rotate(i * Degrees.toRadians(90))
		.round()
))

function investigateCorner(floorTiles: Vecset2, tile: Vec2, pattern: Vec2[]) {
	const [offsetA, offsetB, offsetC] = pattern
	const a = tile.clone().add(offsetA)
	const b = tile.clone().add(offsetB)
	const c = tile.clone().add(offsetC)

	const isKissing = (
		!floorTiles.has(a) &&
		floorTiles.has(b) &&
		!floorTiles.has(c)
	)

	return {isKissing, a, b, c}
}

export function fixKissingCorners(floorTiles: Vec2[]) {
	const set = new Vecset2(floorTiles)
	const added = new Vecset2()

	for (const _ of loop(100)) {
		let fixes = 0

		for (const tile of set.values()) {
			for (const pattern of fourCornerPatterns) {
				const corner = investigateCorner(set, tile, pattern)
				if (corner.isKissing) {
					set.add(corner.a)
					added.add(corner.a)
					fixes += 1
				}
			}
		}

		if (fixes === 0)
			break
	}

	return added
}

