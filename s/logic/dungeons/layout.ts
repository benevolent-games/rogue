
import {Vec2} from "@benev/toolbox"
import {Vecmap2} from "./layouting/vecmap2.js"
import {TileStore} from "./layouting/tile-store.js"
import {DungeonOptions} from "./layouting/types.js"
import {inferWallTiles} from "./layouting/infer-wall-tiles.js"
import {DungeonSpace, GlobalCellVec2} from "./layouting/space.js"
import {fixKissingCorners} from "./layouting/fix-kissing-corners.js"
import {generateFloorTiles, generateSectors} from "./layouting/floorplan.js"

export class DungeonLayout {
	space: DungeonSpace
	floors: TileStore
	walls: TileStore
	goalposts: Vecmap2<GlobalCellVec2, Vec2[]>

	constructor(public options: DungeonOptions) {
		const space = new DungeonSpace(options)
		const sectors = generateSectors(space)
		const {floors, goalposts} = generateFloorTiles(space, sectors)

		const fixes = fixKissingCorners([...floors.lookup.keys()])
		floors.insertGlobalTiles(fixes.array())

		const wallTiles = inferWallTiles([...floors.tiles()])
		const walls = new TileStore(space)
		walls.insertGlobalTiles(wallTiles.array())

		this.space = space
		this.floors = floors
		this.walls = walls
		this.goalposts = goalposts
	}

	getSpawnTiles() {
		const {sector, cell, tiles} = this.floors.firstCell()
		return tiles.array().map(tile => this.space.toGlobalTileSpace(sector, cell, tile))
	}
}

