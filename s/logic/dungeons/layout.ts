
import {Vec2} from "@benev/toolbox"
import {Profiler} from "../../tools/profiler.js"
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
		const profiler = new Profiler("dungeon layout")

		const space = new DungeonSpace(options)
		const sectors = generateSectors(space)
		profiler.capture("generate sectors")

		const {floors, goalposts} = generateFloorTiles(space, sectors)
		profiler.capture("generate floor tiles")

		const fixes = fixKissingCorners([...floors.lookup.keys()])
		profiler.capture("fix kissing corners")

		floors.insertGlobalTiles(fixes.array())
		profiler.capture("insert fixes")

		const wallTiles = inferWallTiles([...floors.tiles()])
		profiler.capture("infer wall tiles")

		const walls = new TileStore(space)
		walls.insertGlobalTiles(wallTiles.array())
		profiler.capture("insert walls")

		profiler.report()

		this.space = space
		this.floors = floors
		this.walls = walls
		this.goalposts = goalposts
	}
}

