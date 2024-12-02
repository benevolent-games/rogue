
import {Trashbin} from "@benev/slate"
import {Degrees, Quat, Randy, Vec2} from "@benev/toolbox"

import {Placement} from "./types.js"
import {Dungeon} from "../../dungeon.js"
import {Realm} from "../../../realm/realm.js"
import {Vecset2} from "../../utils/vecset2.js"
import {DungeonPlacer} from "./dungeon-placer.js"
import {DungeonSkinStats} from "./dungeon-skin-stats.js"
import {planWallSkinning} from "./plan-wall-skinning.js"
import {DungeonAssets} from "./../utils/dungeon-assets.js"
import {DungeonSpawners} from "./../utils/dungeon-style.js"
import {Crate} from "../../../../tools/babylon/logistics/crate.js"
import {cardinals, ordinals} from "../../../../tools/directions.js"

/** Graphical representation of a dungeon */
export class DungeonSkin {
	randy = Randy.seed(1)
	trashbin = new Trashbin()
	stats = new DungeonSkinStats()

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
		const {dungeon, realm, stats, spawners} = this

		for (const sector of this.dungeon.sectors) {
			stats.sectors++
			this.spawnIndicator({
				location: dungeon.tilespace(sector),
				crate: realm.env.indicators.sector,
				offset: -0.02,
				scale: 0.999,
			})
		}

		for (const {cell, sector} of this.dungeon.cells) {
			stats.cells++
			this.spawnIndicator({
				location: dungeon.tilespace(sector, cell),
				crate: realm.env.indicators.cell,
				offset: -0.01,
				scale: 0.99,
			})
		}

		const walkables = dungeon.getWalkables()
		const unwalkables = dungeon.getUnwalkables(walkables)

		// // TODO
		// const walkables = new Vecset2([
		// 	...[...loop2d([4, 4])].map(v => Vec2.array(v)),
		// ])

		for (const walkable of walkables.list()) {
			const radians = Degrees.toRadians(this.randy.choose([0, -90, 90, 180]))
			this.spawn({location: walkable, radians}, spawners.floor.size1x1)
			stats.floors++
		}

		for (const unwalkable of unwalkables.list()) {
			for (const report of planWallSkinning(unwalkable, walkables)) {
				if (report.wall) {
					stats.walls++
					this.spawn(report.wall, spawners.wall.size1)
				}

				if (report.concave) {
					stats.concaves++
					this.spawn(report.concave, spawners.concave)
				}

				if (report.convex) {
					stats.convexes++
					this.spawn(report.convex, spawners.convex)
				}

				for (const stump of report.stumps) {
					stats.stumps++
					this.spawn(stump, spawners.wall.sizeHalf)
				}
			}
		}
	}

	spawnIndicator(options: {
			location: Vec2,
			crate: Crate
			offset: number,
			scale: number,
		}) {
		const {position, scale} = this.placer.placeIndicator(
			options.location,
			this.dungeon.sectorSize,
			options.offset,
		)
		const rotation = Quat.rotate_(0, Degrees.toRadians(90), 0)
		const instance = options.crate.instance({
			position,
			rotation,
			scale: scale.multiplyBy(options.scale),
		})
		this.trashbin.disposable(instance)
		return instance
	}

	spawn(placement: Placement, crate: Crate) {
		const spatial = this.placer.placeProp(placement)
		const instance = crate.instance(spatial)
		this.trashbin.disposable(instance)
		return instance
	}

	dispose() {
		this.trashbin.dispose()
	}
}

