
import {Map2} from "@benev/slate"

import {Vec2} from "@benev/toolbox"
import {Box2} from "../physics/shapes/box2.js"
import {Vecset2} from "./layouting/vecset2.js"
import {DungeonOptions} from "./layouting/types.js"
import {inferWallTiles} from "./layouting/infer-wall-tiles.js"
import {Collisions2} from "../physics/facilities/collisions2.js"
import {generateBroadplan} from "./layouting/generate-broadplan.js"
import {generateCellTiles} from "./layouting/generate-cell-tiles.js"
import {eliminateKissingCorners} from "./layouting/eliminate-kissing-corners.js"
import {DungeonSpace, GlobalSectorVec2, GlobalTileVec2, LocalCellVec2, LocalTileVec2} from "./layouting/space.js"

export class DungeonLayout {
	space: DungeonSpace

	sectors: Map2<GlobalSectorVec2, LocalCellVec2[]>
	wallTiles: Vecset2<GlobalTileVec2>
	cells: LocalTileVec2[] = []
	floorTiles = new Vecset2<GlobalTileVec2>()
	spawnpoints = new Vecset2<GlobalTileVec2>()

	#tileLookups = new Map2<GlobalTileVec2, {sector: GlobalSectorVec2, cell: LocalCellVec2}>()

	constructor(public options: DungeonOptions) {
		this.space = new DungeonSpace(options)

		const broadplan = generateBroadplan(this.space)
		this.sectors = broadplan.sectors
		this.cells = [...this.sectors.values()].flat()

		for (const result of generateCellTiles(this.space, broadplan)) {
			this.floorTiles.add(...result.floorTiles)
			this.spawnpoints.add(...result.spawnpoints)
		}

		eliminateKissingCorners(this.floorTiles)
		this.wallTiles = inferWallTiles(this.floorTiles)

		for (const tile of [...this.floorTiles.list(), ...this.wallTiles.list()]) {
			for (const [sector, cells] of broadplan.sectors) {
				for (const cell of cells) {
					const cellCorner = this.space.toGlobalTileSpace(sector, cell)
					const cellBox = new Box2(cellCorner, this.space.cellSize)
					if (Collisions2.pointVsBox(tile, cellBox))
						this.#tileLookups.set(tile, {sector, cell})
				}
			}
		}
	}

	lookupTile(tile: Vec2) {
		return this.#tileLookups.require(tile)
	}
}

