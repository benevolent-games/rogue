
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonStyle} from "./style.js"
import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {Culler} from "./culling/culler.js"
import {DungeonLayout} from "../layout.js"
import {WallSegment} from "./walls/types.js"
import {WallFader} from "./walls/wall-fader.js"
import {planWalls} from "./walls/plan-walls.js"
import {Vecmap2} from "../layouting/vecmap2.js"
import {DungeonPlacer} from "./utils/placer.js"
import {planFloor} from "./floors/plan-floor.js"
import {WallSubject} from "./walls/wall-subject.js"
import {SubjectGrid} from "./culling/subject-grid.js"
import {CullingSubject} from "./culling/culling-subject.js"
import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {GlobalTileVec2, LocalCellVec2} from "../layouting/space.js"

export class DungeonSkin {
	randy: Randy
	placer: DungeonPlacer

	assets: DungeonAssets
	styleKeyByCell = new Vecmap2<LocalCellVec2, string>()

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

		for (const cells of this.layout.tree.values())
			for (const cell of cells.keys())
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
			const spawn = () => {
				const instance = cargo.instance(spatial)
				instance.freezeWorldMatrix()
				return instance
			}
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
			const spawn = () => {
				const prop = cargo.clone(spatial)
				prop.freezeWorldMatrix()
				return prop
			}
			const subject = new WallSubject(wall, spawn)
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

