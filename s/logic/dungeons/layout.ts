
import {Map2} from "@benev/slate"

import {Vecset2} from "./layouting/vecset2.js"
import {DungeonOptions} from "./layouting/types.js"
import {inferWallTiles} from "./layouting/infer-wall-tiles.js"
import {generateBroadplan} from "./layouting/generate-broadplan.js"
import {generateCellTiles} from "./layouting/generate-cell-tiles.js"
import {eliminateKissingCorners} from "./layouting/eliminate-kissing-corners.js"
import {DungeonSpace, GlobalSectorVec2, GlobalTileVec2, LocalCellVec2} from "./layouting/space.js"

export class DungeonLayout {
	space: DungeonSpace

	sectors: Map2<GlobalSectorVec2, LocalCellVec2[]>
	wallTiles: Vecset2<GlobalTileVec2>
	floorTiles = new Vecset2<GlobalTileVec2>()
	spawnpoints = new Vecset2<GlobalTileVec2>()
	sectorByTiles = new Map2<GlobalTileVec2, GlobalSectorVec2>()

	constructor(public options: DungeonOptions) {
		this.space = new DungeonSpace(options)

		const broadplan = generateBroadplan(this.space)
		this.sectors = broadplan.sectors

		for (const result of generateCellTiles(this.space, broadplan)) {
			this.floorTiles.add(...result.floorTiles)
			this.spawnpoints.add(...result.spawnpoints)
		}

		eliminateKissingCorners(this.floorTiles)
		this.wallTiles = inferWallTiles(this.floorTiles)

		const sectorVectors = [...this.sectors.keys()]

		for (const tile of [...this.floorTiles.list(), ...this.wallTiles.list()]) {
			this.sectorByTiles.set(tile, this.space.getSectorThatContainsTile(tile, sectorVectors))
		}
	}
}

