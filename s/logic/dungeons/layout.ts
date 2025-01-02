
import {Vec2} from "@benev/toolbox"
import {DungeonSpace} from "./layouting/space.js"
import {TileStore} from "./layouting/tile-store.js"
import {DungeonOptions} from "./layouting/types.js"
import {inferWallTiles} from "./layouting/infer-wall-tiles.js"
import {fixKissingCorners} from "./layouting/fix-kissing-corners.js"
import {generateFloorTiles, generateSectors} from "./layouting/floorplan.js"

export class DungeonLayout {
	space: DungeonSpace
	floors: TileStore
	walls: TileStore
	goalposts: Vec2[]

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
}

