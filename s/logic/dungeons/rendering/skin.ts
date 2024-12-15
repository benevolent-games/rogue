
import {Trashbin} from "@benev/slate"
import {Degrees, Quat, Randy, Vec2} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Placement} from "./types.js"
import {DungeonPlacer} from "./placer.js"
import {Realm} from "../../realm/realm.js"
import {Culler} from "./culling/culler.js"
import {WallFader} from "./walls/wall-fader.js"
import {DungeonSkinStats} from "./skin-stats.js"
import {DungeonLayout} from "../dungeon-layout.js"
import {WallSubject} from "./walls/wall-subject.js"
import {SubjectGrid} from "./culling/subject-grid.js"
import {planWallSkinning} from "./plan-wall-skinning.js"
import {DungeonSpawners, DungeonStyle} from "./style.js"
import {CullingSubject} from "./culling/culling-subject.js"
import {Crate} from "../../../tools/babylon/logistics/crate.js"

/** Graphical representation of a dungeon */
export class DungeonSkin {
	randy: Randy
	trashbin = new Trashbin()
	stats = new DungeonSkinStats()

	cullableGrid = new SubjectGrid()
	fadingGrid = new SubjectGrid<WallSubject>()

	culler = new Culler(this.cullableGrid)
	wallFader = new WallFader(this.fadingGrid)

	placer: DungeonPlacer
	spawners: DungeonSpawners

	constructor(
			public dungeon: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {
		const {seed} = dungeon.options
		this.randy = new Randy(seed)
		const [style] = [...DungeonStyle.extractFromContainer(seed, container).values()]
		this.placer = new DungeonPlacer(mainScale)
		this.spawners = style.makeSpawners()

		for (const material of container.materials)
			material.freeze()

		this.actuate()
	}

	actuate() {
		const {dungeon, stats, spawners, cullableGrid, fadingGrid} = this

		// // TODO extract this to a separate optional facility

		// for (const sector of this.dungeon.sectors) {
		// 	stats.sectors++
		// 	this.spawnIndicator({
		// 		location: dungeon.tilespace(sector),
		// 		crate: realm.env.indicators.sector,
		// 		offset: -0.02,
		// 		scale: 0.9985,
		// 		size: dungeon.sectorSize,
		// 	})
		// }
		//
		// for (const {cell, sector} of this.dungeon.cells) {
		// 	stats.cells++
		// 	this.spawnIndicator({
		// 		location: dungeon.tilespace(sector, cell),
		// 		crate: realm.env.indicators.cell,
		// 		offset: -0.01,
		// 		scale: 0.99,
		// 		size: dungeon.cellSize,
		// 	})
		// }

		const {walkables, unwalkables} = dungeon

		for (const walkable of walkables.list()) {
			stats.floors++
			const radians = Degrees.toRadians(this.randy.choose([0, -90, 90, 180]))
			const spawner = () => this.spawn({location: walkable, radians}, spawners.floor.size1x1)
			const subject = new CullingSubject(walkable, spawner)
			cullableGrid.add(subject)
		}

		for (const unwalkable of unwalkables.list()) {
			for (const report of planWallSkinning(unwalkable, walkables)) {
				if (report.wall) {
					stats.walls++
					const spawner = () => this.spawn(report.wall!, spawners.wall.size1)
					const subject = new WallSubject(unwalkable, report.wall.location, spawner)
					cullableGrid.add(subject)
					fadingGrid.add(subject)
				}

				if (report.concave) {
					stats.concaves++
					const spawner = () => this.spawn(report.concave!, spawners.concave)
					const subject = new WallSubject(unwalkable, report.concave.location, spawner)
					cullableGrid.add(subject)
					fadingGrid.add(subject)
				}

				if (report.convex) {
					stats.convexes++
					const spawner = () => this.spawn(report.convex!, spawners.convex)
					const subject = new WallSubject(unwalkable, report.convex.location, spawner)
					cullableGrid.add(subject)
					fadingGrid.add(subject)
				}

				for (const stump of report.stumps) {
					stats.stumps++
					const spawner = () => this.spawn(stump!, spawners.wall.sizeHalf)
					const subject = new WallSubject(unwalkable, stump.location, spawner)
					cullableGrid.add(subject)
					fadingGrid.add(subject)
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
		const instance = crate.clone(spatial)
		instance.freezeWorldMatrix()
		this.trashbin.disposable(instance)
		return instance
	}

	dispose() {
		this.trashbin.dispose()
	}
}

