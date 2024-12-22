
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {DungeonOptions} from "./types.js"

export type GlobalSectorVec2 = Vec2

export type LocalCellVec2 = Vec2
export type GlobalCellVec2 = Vec2

export type LocalTileVec2 = Vec2
export type GlobalTileVec2 = Vec2

export class DungeonSpace {
	randy: Randy
	cellGrid: Grid
	tileGrid: Grid
	cellSize: Vec2
	sectorSize: Vec2

	constructor(public options: DungeonOptions) {
		const {seed, gridExtents} = options
		this.randy = new Randy(seed)
		this.cellGrid = new Grid(Vec2.array(gridExtents.cells))
		this.tileGrid = new Grid(Vec2.array(gridExtents.tiles))
		this.cellSize = this.tileGrid.extent.clone()
		this.sectorSize = this.tileGrid.extent.clone().multiply(this.cellGrid.extent)
	}

	toGlobalCellSpace(globalSector: Vec2, localCell = Vec2.zero()) {
		return this.cellGrid.extent.clone().multiply(globalSector).add(localCell)
	}

	toGlobalTileSpace(globalSector: Vec2, localCell = Vec2.zero(), localTile = Vec2.zero()) {
		const sectorOffset = this.sectorSize.clone().multiply(globalSector)
		const cellOffset = this.cellSize.clone().multiply(localCell)
		const tileOffset = localTile.clone()
		return Vec2.zero().add(sectorOffset, cellOffset, tileOffset)
	}
}

