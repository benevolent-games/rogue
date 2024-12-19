
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonStyle} from "./style.js"
import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../layout.js"
import {WallSegment} from "./walls/types.js"
import {planWalls} from "./walls/plan-walls.js"
import {planFloor} from "./floors/plan-floor.js"
import {DungeonPlacer} from "../rendering/placer.js"
import {Culler} from "../rendering/culling/culler.js"
import {WallFader} from "../rendering/walls/wall-fader.js"
import {WallSubject} from "../rendering/walls/wall-subject.js"
import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {SubjectGrid} from "../rendering/culling/subject-grid.js"
import {GlobalTileVec2, LocalCellVec2} from "../layouting/space.js"
import {CullingSubject} from "../rendering/culling/culling-subject.js"

export class DungeonSkin {
	randy: Randy
	placer: DungeonPlacer

	assets: DungeonAssets
	styleKeyByCell = new Map2<LocalCellVec2, string>()

	cullableGrid = new SubjectGrid()
	fadingGrid = new SubjectGrid<WallSubject>()

	culler = new Culler(this.cullableGrid)
	wallFader = new WallFader(this.fadingGrid)

	constructor(
			public layout: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {

		this.randy = new Randy(layout.options.seed)
		this.assets = new DungeonAssets(container, this.randy)
		this.placer = new DungeonPlacer(mainScale)

		const styles = [...this.assets.styles.keys()]

		for (const cell of this.layout.cells)
			this.styleKeyByCell.set(cell, this.randy.choose(styles))

		this.#createFlooring()
		this.#createWalls()
	}

	#getStyle = (tile: GlobalTileVec2) => {
		const {cell} = this.layout.lookupTile(tile)
		const key = this.styleKeyByCell.require(cell)
		return this.assets.styles.require(key)
	}

	#createFlooring() {
		const floorPlan = planFloor(
			this.randy,
			this.layout.floorTiles,
			this.#getStyle,
		)

		for (const floor of floorPlan.values()) {
			const size = `${floor.size.x}x${floor.size.y}`
			const cargo = floor.style.floors.require(size)()
			const radians = floor.rotation
			const spatial = this.placer.placeProp({location: floor.location, radians})
			const spawn = () => cargo.instance(spatial)
			const subject = new CullingSubject(floor.location, spawn)
			this.cullableGrid.add(subject)
		}
	}

	#createWalls() {
		const plan = planWalls(
			this.randy,
			this.layout.wallTiles,
			this.layout.floorTiles,
			this.#getStyle,
		)

		const make = (wall: WallSegment, getCargo: (style: DungeonStyle) => Cargo) => {
			const style = this.#getStyle(wall.tile)
			const cargo = getCargo(style)
			const spatial = this.placer.placeProp(wall)
			const spawn = () => cargo.clone(spatial)
			const subject = new WallSubject(wall.tile, wall.location, spawn)
			this.cullableGrid.add(subject)
			this.fadingGrid.add(subject)
		}

		for (const wall of plan.wallSegments)
			make(wall, style => style.walls.require(wall.size)())

		for (const concave of plan.concaves)
			make(concave, style => style.concave())

		for (const convex of plan.convexes)
			make(convex, style => style.convex())

		for (const stump of plan.stumps)
			make(stump, style => style.stump())
	}

	dispose() {
		this.cullableGrid.dispose()
		this.fadingGrid.dispose()
	}
}

