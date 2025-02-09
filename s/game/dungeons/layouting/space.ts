
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

	toGlobalCellSpace(sector: Vec2, cell = Vec2.zero()) {
		return this.cellGrid.extent.clone().multiply(sector).add(cell)
	}

	toGlobalTileSpace(sector: Vec2, cell = Vec2.zero(), tile = Vec2.zero()) {
		const sectorOffset = this.sectorSize.clone().multiply(sector)
		const cellOffset = this.cellSize.clone().multiply(cell)
		const tileOffset = tile.clone()
		return Vec2.zero().add(sectorOffset, cellOffset, tileOffset)
	}

	toLocalTileSpace(sector: Vec2, cell: Vec2, tile: Vec2) {
		const cellOffset = this.toGlobalCellSpace(sector, cell)
		return tile.clone().subtract(cellOffset)
	}

	localize(globalTile: Vec2) {
		const globalCell = globalTile.clone()
			.divide(this.tileGrid.extent)
			.floor()

		const sector = globalCell.clone()
			.divide(this.cellGrid.extent)
			.floor()

		const cell = globalCell.clone()
			.subtract(sector.clone().multiply(this.cellGrid.extent))

		const tile = globalTile.clone()
			.subtract(globalCell.clone().multiply(this.tileGrid.extent))

		return {sector, cell, tile}
	}
}

