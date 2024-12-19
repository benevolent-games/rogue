
import {Vec2} from "@benev/toolbox"

import {FloorSegment} from "./types.js"
import {DungeonStyle} from "../style.js"
import {decodeSizeString, size1} from "./utils.js"
import {range2d} from "../../../../tools/range.js"
import {HashSet} from "../../../../tools/hash/set.js"

export function mergeFlooring(style: DungeonStyle, floorPlan: HashSet<FloorSegment>) {
	const sizes = [...style.floors.keys()]
		.map(string => decodeSizeString(string))
		.sort((a, b) => (b.x * b.y) - (a.x * a.y))

	for (const size of sizes) {
		if (size.equals(size1)) continue

		for (const floor of floorPlan.values()) {
			if (!floor.size.equals(size1)) continue

			const area = size.x * size.y
			const boxTiles = range2d(size)
				.map(vector => ({
					tile: floor.tile.clone().add(vector),
					size: size1,
					style: floor.style,
					location: floor.location.clone().add(vector),
				}))
				.filter(tile2 => floorPlan.has(tile2))
			const wholeBoxIsIntact = boxTiles.length === area

			if (wholeBoxIsIntact) {
				floorPlan.delete(...boxTiles)
				floorPlan.add({
					tile: floor.tile,
					size,
					style: floor.style,
					location: Vec2.zero()
						.add(...boxTiles.map(t => t.location))
						.divideBy(boxTiles.length),
				})
			}

		}
	}
}

