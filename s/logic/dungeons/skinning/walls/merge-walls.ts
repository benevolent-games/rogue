
import {Degrees, Randy, Vec2} from "@benev/toolbox"

import {range} from "../../../../tools/range.js"
import {Vecmap2} from "../../layouting/vecmap2.js"
import {FinalWallSegments, WallInfo} from "./types.js"
import {randyShuffle} from "../../../../tools/temp/randy-shuffle.js"

const north = new Vec2(0, 1)

const angles = [
	Degrees.toRadians(0), // north
	Degrees.toRadians(90), // west
	Degrees.toRadians(180), // south
	Degrees.toRadians(270), // east
]

const neighbors = angles.map(r => north.clone().rotate(r).round())

export function mergeWalls(
		randy: Randy,
		sizes: number[],
		walls: WallInfo[],
	) {

	walls = randyShuffle(randy, [...walls])

	const wallMap = new Vecmap2<FinalWallSegments>(
		walls.map(w => [w.tile, {...w, size: 1}])
	)

	// descending
	sizes.sort((a, b) => b - a)

	for (const angleIndex of angles.keys()) {
		for (const size of sizes) {
			if (size === 1) break

			for (const wall of walls) {
				const strip = range(size)
					.map(n => wall.tile.clone()
						.add(neighbors.at(angleIndex)!.clone().multiplyBy(n))
					)
					.map(vector => wallMap.get(vector))
					.filter(v => !!v)

				const wholeStripIsContiguous = (strip.length === size) && strip.every(stripWall =>
					(stripWall.size === 1 && stripWall.radians === wall.radians)
				)

				if (wholeStripIsContiguous) {
					// delete little walls of size 1
					for (const {tile} of strip)
						wallMap.delete(tile)

					// calculate the "middle" location of the strip
					const averageLocation = strip
						.map(wall => wall.location)
						.reduce((p, c) => p.add(c), Vec2.zero())
						.divideBy(strip.length)

					// add bigger wall segment to account for the whole strip
					wallMap.set(wall.tile, {
						size,
						tile: wall.tile,
						radians: wall.radians,
						location: averageLocation,
					})
				}
			}
		}
	}

	return [...wallMap.values()]
}

