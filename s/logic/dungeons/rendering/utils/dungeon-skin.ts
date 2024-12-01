
import {Trashbin} from "@benev/slate"
import {Degrees, Quat, Vec2} from "@benev/toolbox"

import {Dungeon} from "../../dungeon.js"
import {Realm} from "../../../realm/realm.js"
import {DungeonPlacer} from "./dungeon-placer.js"
import {DungeonSkinStats} from "./dungeon-skin-stats.js"
import {DungeonAssets} from "./../utils/dungeon-assets.js"
import {DungeonSpawners} from "./../utils/dungeon-style.js"

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
			this.makeSectorIndicator(sector)

		for (const {cell, sector, tiles} of this.dungeon.cells) {
			this.makeCellIndicator(cell, sector)

			for (const tile of tiles)
				this.makeFloorTile(tile, cell, sector)
		}
	}

	makeSectorIndicator(sector: Vec2) {
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

	makeCellIndicator(cell: Vec2, sector: Vec2) {
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

	makeFloorTile(tile: Vec2, cell: Vec2, sector: Vec2) {
		const location = this.dungeon.tilespace(sector, cell, tile)
		const {position, scale, rotation} = this.placer.placeFloor(location)
		const instance = this.spawners.floor.size1x1({position, scale, rotation})
		this.trashbin.disposable(instance)
		this.stats.tiles++
		return instance
	}

	dispose() {
		this.trashbin.dispose()
	}
}

