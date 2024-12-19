
import {Map2} from "@benev/slate"
import {Randy, Vec2} from "@benev/toolbox"

import {FloorSegment} from "./types.js"
import {DungeonStyle} from "../style.js"
import {hashFloor, size1} from "./utils.js"
import {mergeFlooring} from "./merge-flooring.js"
import {Vecset2} from "../../layouting/vecset2.js"
import {HashSet} from "../../../../tools/hash/set.js"
import {randyShuffle} from "../../../../tools/temp/randy-shuffle.js"

export function planFloor(
		randy: Randy,
		floorTiles: Vecset2,
		getStyle: (tile: Vec2) => DungeonStyle
	) {

	const floorTilesByStyle = new Map2<DungeonStyle, Vec2[]>()

	for (const tile of floorTiles.values()) {
		const style = getStyle(tile)
		const tiles = floorTilesByStyle.guarantee(style, () => [])
		tiles.push(tile)
	}

	return floorTilesByStyle.array().flatMap(([style, tiles]) => {
		const floorPlan = new HashSet<FloorSegment>(
			hashFloor,
			randyShuffle(randy, tiles.map(tile => ({
				tile,
				style,
				size: size1,
				location: tile.clone(),
			}))),
		)
		mergeFlooring(style, floorPlan)
		return floorPlan.array()
	})
}

