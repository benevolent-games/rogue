
import {Degrees, Randy, Vec2} from "@benev/toolbox"

import {WallSegment} from "./types.js"
import {range} from "../../../../tools/range.js"
import {HashSet} from "../../../../tools/hash/set.js"
import {randyShuffle} from "../../../../tools/temp/randy-shuffle.js"

const north = new Vec2(0, 1)

const angles = [
	Degrees.toRadians(0), // north
	Degrees.toRadians(90), // west
	Degrees.toRadians(180), // south
	Degrees.toRadians(270), // east
]

const neighbors = angles.map(r => north.clone().rotate(r).round())

class WallSegmentSet extends HashSet<WallSegment> {
	constructor(walls: WallSegment[]) {
		super(wall => `${wall.size},${wall.radians},${wall.tile.x},${wall.tile.y}`, walls)
	}
}

export function mergeWalls(
		randy: Randy,
		rawSizes: number[],
		rawWalls: WallSegment[],
	) {

	const wallSet = new WallSegmentSet(
		randyShuffle(randy, [...rawWalls])
	)

	// descending
	const sizes = rawSizes.toSorted((a, b) => b - a)

	// first, we consider contiguousness by directionality
	for (const angleIndex of angles.keys()) {

		// second, we consider the largest to smallest sizes
		for (const size of sizes) {

			// walls at size 1 or less do not need merging
			if (size <= 1) continue

			// thirdly, we consider each wall
			for (const wall of wallSet.values()) {

				// we identify contiguous strips
				const strip = range(size)
					.map(n => wall.tile.clone()
						.add(neighbors.at(angleIndex)!.clone().multiplyBy(n))
					)
					.map(tile => wallSet.get({
						tile,
						size: 1,
						radians: wall.radians,
						location: wall.location,
					}))
					.filter(v => !!v)

				// if the strip reaches the target size, we perform a merge
				if (strip.length === size) {
					const [first] = strip

					// delete the strip's original walls
					wallSet.delete(...strip)

					// calculate the "middle" location of the strip
					const averageLocation = strip
						.map(wall => wall.location)
						.reduce((p, c) => p.add(c), Vec2.zero())
						.divideBy(strip.length)

					// add the bigger replacement wall segment representing the whole strip
					wallSet.add({
						size,
						tile: first.tile,
						radians: first.radians,
						location: averageLocation,
					})
				}
			}
		}
	}

	return wallSet.array()
}

