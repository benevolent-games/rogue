
import {Degrees, Randy, Vec2} from "@benev/toolbox"

import {FloorSegment} from "./types.js"
import {DungeonStyle} from "../style.js"
import {decodeSizeString, tileExtent} from "./utils.js"
import {range2d} from "../../../../tools/range.js"
import {HashSet} from "../../../../tools/hash/set.js"
import {randyShuffle} from "../../../../tools/temp/randy-shuffle.js"

const rotations = [
	0,
	Degrees.toRadians(90),
	Degrees.toRadians(180),
	Degrees.toRadians(270),
]

export function mergeFlooring(randy: Randy, style: DungeonStyle, floorPlan: HashSet<FloorSegment>) {
	const sizes = [...style.floors.keys()]
		.map(string => decodeSizeString(string))
		.sort((a, b) => (b.x * b.y) - (a.x * a.y))

	for (const size of sizes) {
		if (size.equals(tileExtent)) continue

		for (const floor of floorPlan.values()) {
			if (!floor.size.equals(tileExtent)) continue

			for (const rotation of randyShuffle(randy, [...rotations])) {
				const rotatedSize = size.clone()
					.rotate(rotation)
					.round()
					.subtract(Vec2.zero())
					.map(x => Math.abs(x))

				const area = rotatedSize.x * rotatedSize.y
				const boxTiles = range2d(rotatedSize)
					.map(vector => ({
						tile: floor.tile.clone().add(vector),
						size: tileExtent,
						style: floor.style,
						rotation: floor.rotation,
						location: floor.location.clone().add(vector),
					}))
					.filter(tile2 => floorPlan.has(tile2))
				const wholeBoxIsIntact = boxTiles.length === area

				if (wholeBoxIsIntact) {
					floorPlan.delete(...boxTiles)
					floorPlan.add({
						tile: floor.tile,
						size,
						rotation,
						style: floor.style,
						location: Vec2.zero()
							.add(...boxTiles.map(t => t.location))
							.divideBy(boxTiles.length),
					})
				}
			}
		}
	}
}

