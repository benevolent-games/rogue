
import {Trashbin} from "@benev/slate"
import {Degrees, Quat, Randy, Vec2} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Placement} from "./types.js"
import {DungeonPlacer} from "./placer.js"
import {Realm} from "../../realm/realm.js"
import {DungeonSkinStats} from "./skin-stats.js"
import {DungeonLayout} from "../dungeon-layout.js"
import {planWallSkinning} from "./plan-wall-skinning.js"
import {DungeonSpawners, DungeonStyle} from "./style.js"
import {Crate} from "../../../tools/babylon/logistics/crate.js"
import {DistanceCuller} from "../../realm/utils/distance-culler.js"

/** Graphical representation of a dungeon */
export class DungeonSkin {
	randy = Randy.seed(1)
	trashbin = new Trashbin()
	culler = new DistanceCuller()
	stats = new DungeonSkinStats()

	placer: DungeonPlacer
	spawners: DungeonSpawners

	constructor(
			public dungeon: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {
		const [style] = [...DungeonStyle.extractFromContainer(container).values()]
		this.placer = new DungeonPlacer(mainScale)
		this.spawners = style.makeSpawners()

		for (const material of container.materials)
			material.freeze()

		this.actuate()
	}

	actuate() {
		const {dungeon, realm, stats, spawners, culler} = this

		for (const sector of this.dungeon.sectors) {
			stats.sectors++
			this.spawnIndicator({
				location: dungeon.tilespace(sector),
				crate: realm.env.indicators.sector,
				offset: -0.02,
				scale: 0.9985,
				size: dungeon.sectorSize,
			})
		}

		for (const {cell, sector} of this.dungeon.cells) {
			stats.cells++
			this.spawnIndicator({
				location: dungeon.tilespace(sector, cell),
				crate: realm.env.indicators.cell,
				offset: -0.01,
				scale: 0.99,
				size: dungeon.cellSize,
			})
		}

		const {walkables, unwalkables} = dungeon

		// // TODO
		// const walkables = new Vecset2([
		// 	...[...loop2d([4, 4])].map(v => Vec2.array(v)),
		// ])

		for (const walkable of walkables.list()) {
			const radians = Degrees.toRadians(this.randy.choose([0, -90, 90, 180]))
			const prop = this.spawn({location: walkable, radians}, spawners.floor.size1x1)
			culler.add(prop, walkable)
			stats.floors++
		}

		for (const unwalkable of unwalkables.list()) {
			for (const report of planWallSkinning(unwalkable, walkables)) {
				if (report.wall) {
					stats.walls++
					const prop = this.spawn(report.wall, spawners.wall.size1)
					culler.add(prop, report.wall.location)
				}

				if (report.concave) {
					stats.concaves++
					const prop = this.spawn(report.concave, spawners.concave)
					culler.add(prop, report.concave.location)
				}

				if (report.convex) {
					stats.convexes++
					const prop = this.spawn(report.convex, spawners.convex)
					culler.add(prop, report.convex.location)
				}

				for (const stump of report.stumps) {
					stats.stumps++
					const prop = this.spawn(stump, spawners.wall.sizeHalf)
					culler.add(prop, stump.location)
				}
			}
		}
	}

	spawnIndicator(options: {
			size: Vec2,
			location: Vec2,
			crate: Crate
			offset: number,
			scale: number,
		}) {
		const {position, scale} = this.placer.placeIndicator(
			options.location,
			options.size,
			options.offset,
		)
		const rotation = Quat.rotate_(Degrees.toRadians(90), 0, 0)
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
		instance.freezeWorldMatrix()
		this.trashbin.disposable(instance)
		return instance
	}

	dispose() {
		this.trashbin.dispose()
	}
}

