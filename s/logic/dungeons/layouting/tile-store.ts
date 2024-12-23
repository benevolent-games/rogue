
import {Vecmap2} from "./vecmap2.js"
import {Vecset2} from "./vecset2.js"
import {DungeonSpace, GlobalCellVec2, GlobalSectorVec2, GlobalTileVec2, LocalCellVec2, LocalTileVec2} from "./space.js"

export class TileStore {
	tree = new Vecmap2<GlobalSectorVec2, Vecmap2<LocalCellVec2, Vecset2<LocalTileVec2>>>()
	lookup = new Vecmap2<GlobalTileVec2, {sector: GlobalSectorVec2, cell: GlobalCellVec2}>

	constructor(public space: DungeonSpace) {}

	add(sector: GlobalSectorVec2, cell: LocalCellVec2, newTiles: LocalTileVec2[]) {
		const cells = this.tree.guarantee(sector, () => new Vecmap2())
		const tiles = cells.guarantee(cell, () => new Vecset2())
		const globalCell = this.space.toGlobalCellSpace(sector, cell)

		for (const tile of newTiles) {
			tiles.add(tile)
			const globalTile = this.space.toGlobalTileSpace(sector, cell, tile)
			this.lookup.set(globalTile, {sector, cell: globalCell})
		}
	}
}

