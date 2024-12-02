
import {Trashbin} from "@benev/slate"
import {Degrees, loop2d, Quat, Vec2} from "@benev/toolbox"

import {Dungeon} from "../../dungeon.js"
import {Realm} from "../../../realm/realm.js"
import {Vecset2} from "../../utils/vecset2.js"
import {DungeonPlacer} from "./dungeon-placer.js"
import {DungeonSkinStats} from "./dungeon-skin-stats.js"
import {DungeonAssets} from "./../utils/dungeon-assets.js"
import {DungeonSpawners} from "./../utils/dungeon-style.js"
import {cardinals, corners} from "../../../../tools/directions.js"
import {Cornering, CornerPlacement, WallPlacement} from "./types.js"
import {getConcaveStumps, getConvexStumps, isConcave, isConvex, isWall} from "./patterns.js"

/** Graphical representation of a dungeon */
export class DungeonSkin {
	trashbin = new Trashbin()
	stats = new DungeonSkinStats()
	indicatorRotation = Quat.rotate_(0, Degrees.toRadians(90), 0)

	placer: DungeonPlacer
	spawners: DungeonSpawners

	constructor(
			public dungeon: Dungeon,
			public assets: DungeonAssets,
			public realm: Realm,
			public mainScale: number,
		) {
		const [style] = [...assets.styles.values()]
		this.placer = new DungeonPlacer(mainScale)
		this.spawners = style.makeSpawners()
		this.actuate()
	}

	actuate() {
		for (const sector of this.dungeon.sectors)
			this.spawnSectorIndicator(sector)

		for (const {cell, sector} of this.dungeon.cells)
			this.spawnCellIndicator(cell, sector)

		// TODO
		const walkables = this.getWalkables()

		// const walkables = new Vecset2([
		// 	...[...loop2d([4, 4])].map(([x, y]) => new Vec2(x, y)),
		// 	...[...loop2d([4, 4])].map(([x, y]) => new Vec2(x, y).add_(-2, 2)),
		// ])

		const cornering = this.getCornering(walkables)
		const walls = this.getWalls(walkables)

		for (const walkable of walkables.list())
			this.spawnFloor2(walkable)

		for (const {location, ordinalIndex} of cornering.concaves)
			this.spawnConcave(location, ordinalIndex)

		for (const {location, ordinalIndex} of cornering.convexes)
			this.spawnConvex(location, ordinalIndex)

		for (const {location, cardinalIndex} of walls)
			this.spawnWall(location, cardinalIndex)

		for (const {location, ordinalIndex} of cornering.concaves) {
			const {left, right} = getConcaveStumps(location, ordinalIndex, walkables)
			if (left)
				this.spawnStump(left, ordinalIndex)
			if (right)
				this.spawnStump(right, ordinalIndex + 1)
		}

		for (const {location, ordinalIndex} of cornering.convexes) {
			const {left, right} = getConvexStumps(location, ordinalIndex, walkables)
			if (left)
				this.spawnStump(left, ordinalIndex + 1)
			if (right) {
				this.spawnStump(right, ordinalIndex)
			}
		}
	}

	getCornering(walkables: Vecset2): Cornering {
		const concaves: CornerPlacement[] = []
		const convexes: CornerPlacement[] = []

		for (const walkable of walkables.list()) {
			corners.forEach((corner, ordinalIndex) => {
				if (isConcave(walkable, corner, walkables))
					concaves.push({location: walkable, ordinalIndex})

				else if (isConvex(walkable, corner, walkables))
					convexes.push({location: walkable, ordinalIndex})
			})
		}
		return {concaves, convexes}
	}

	getWalls(walkables: Vecset2) {
		const walls: WallPlacement[] = []
		for (const walkable of walkables.list()) {
			for (const cardinalIndex of cardinals.keys()) {
				if (isWall(walkable, cardinalIndex, walkables))
					walls.push({location: walkable, cardinalIndex})
			}
		}
		return walls
	}

	getWalkables() {
		return new Vecset2(
			this.dungeon.cells.flatMap(({sector, cell, tiles}) =>
				tiles.map(tile => this.dungeon.tilespace(sector, cell, tile))
			)
		)
	}

	// getUnwalkables(walkables: Vecset2) {
	// 	const walls = new Vecset2(
	// 		walkables.list().flatMap(
	// 			tile => cardinals.map(c => tile.clone().add(c))
	// 		)
	// 	)
	// 	return new Vecset2(
	// 		walls.list().filter(wall => !walkables.has(wall))
	// 	)
	// }

	spawnSectorIndicator(sector: Vec2) {
		const location = this.dungeon.tilespace(sector)
		const {position, scale} = this.placer
			.placeIndicator(location, this.dungeon.sectorSize, -0.02)
		const instance = this.realm.env.indicators.sector.instance({
			position,
			rotation: this.indicatorRotation,
			scale: scale.multiplyBy(0.999),
		})
		this.trashbin.disposable(instance)
		this.stats.sectors++
		return instance
	}

	spawnCellIndicator(cell: Vec2, sector: Vec2) {
		const location = this.dungeon.tilespace(sector, cell)
		const {position, scale} = this.placer
			.placeIndicator(location, this.dungeon.cellSize, -0.01)
		const instance = this.realm.env.indicators.cell.instance({
			position,
			rotation: this.indicatorRotation,
			scale: scale.multiplyBy(0.99),
		})
		this.trashbin.disposable(instance)
		this.stats.cells++
		return instance
	}

	spawnFloor(tile: Vec2, cell: Vec2, sector: Vec2) {
		const location = this.dungeon.tilespace(sector, cell, tile)
		const spatial = this.placer.placeFloor(location)
		const instance = this.spawners.floor.size1x1(spatial)
		this.trashbin.disposable(instance)
		this.stats.tiles++
		return instance
	}

	spawnFloor2(location: Vec2) {
		const spatial = this.placer.placeFloor(location)
		const instance = this.spawners.floor.size1x1(spatial)
		this.trashbin.disposable(instance)
		this.stats.tiles++
		return instance
	}

	spawnConcave(location: Vec2, cornerIndex: number) {
		const spatial = this.placer.placeCorner(location, cornerIndex)
		const instance = this.spawners.concave(spatial)
		this.trashbin.disposable(instance)
		this.stats.concaves++
		return instance
	}

	spawnConvex(location: Vec2, ordinalIndex: number) {
		const spatial = this.placer.placeCorner(location, ordinalIndex)
		const instance = this.spawners.convex(spatial)
		this.trashbin.disposable(instance)
		this.stats.convexes++
		return instance
	}

	spawnWall(tileLocation: Vec2, cardinalIndex: number) {
		const spatial = this.placer.placeWall(tileLocation, cardinalIndex)
		const instance = this.spawners.wall.size1(spatial)
		this.trashbin.disposable(instance)
		this.stats.walls++
		return instance
	}

	spawnStump(tileLocation: Vec2, cardinalIndex: number) {
		const spatial = this.placer.placeWall(tileLocation, cardinalIndex)
		const instance = this.spawners.wall.sizeHalf(spatial)
		this.trashbin.disposable(instance)
		this.stats.stumps++
		return instance
	}

	dispose() {
		this.trashbin.dispose()
	}
}

