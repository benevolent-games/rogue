
import {Vec2} from "@benev/toolbox"
import {Vecmap2} from "./vecmap2.js"
import {Vecset2} from "./vecset2.js"
import {DungeonSpace, GlobalCellVec2, GlobalSectorVec2, GlobalTileVec2, LocalCellVec2, LocalTileVec2} from "./space.js"

export class TileStore {
	set = new Vecset2<Vec2>
	sectors = new Vecmap2<GlobalSectorVec2, Vecmap2<LocalCellVec2, Vecset2<LocalTileVec2>>>()
	lookup = new Vecmap2<GlobalTileVec2, {sector: GlobalSectorVec2, cell: GlobalCellVec2}>

	constructor(public space: DungeonSpace) {}

	add(sector: GlobalSectorVec2, cell: LocalCellVec2, newTiles: LocalTileVec2[]) {
		const cells = this.sectors.guarantee(sector, () => new Vecmap2())
		const tiles = cells.guarantee(cell, () => new Vecset2())
		const globalCell = this.space.toGlobalCellSpace(sector, cell)

		for (const tile of newTiles) {
			tiles.add(tile)
			const globalTile = this.space.toGlobalTileSpace(sector, cell, tile)
			this.set.add(globalTile)
			this.lookup.set(globalTile, {sector, cell: globalCell})
		}
	}

	insertGlobalTiles(newTiles: GlobalTileVec2[]) {
		for (const globalTile of newTiles) {
			const {sector, cell, tile} = this.space.localize(globalTile)
			this.add(sector, cell, [tile])
		}
	}

	*cells() {
		for (const [sector, cells] of this.sectors.entries())
			for (const cell of cells.keys())
				yield this.space.toGlobalCellSpace(sector, cell)
	}

	*tiles() {
		for (const [sector, cells] of this.sectors.entries())
			for (const [cell, tiles] of cells.entries())
				for (const tile of tiles.values())
					yield this.space.toGlobalTileSpace(sector, cell, tile)
	}

	*[Symbol.iterator]() {
		for (const [sector, cells] of this.sectors.entries())
			for (const [cell, tiles] of cells.entries())
				yield {sector, cell, tiles}
	}

	firstCell() {
		const [sector, cells] = this.sectors.entries().next().value!
		const [cell, tiles] = cells.entries().next().value!
		return {sector, cell, tiles}
	}
}

