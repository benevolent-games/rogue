
import {Map2} from "@benev/slate"
import {Degrees, Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../layout.js"
import {DungeonPlacer} from "../rendering/placer.js"
import {Culler} from "../rendering/culling/culler.js"
import {WallFader} from "../rendering/walls/wall-fader.js"
import {WallSubject} from "../rendering/walls/wall-subject.js"
import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {SubjectGrid} from "../rendering/culling/subject-grid.js"
import {Spatial} from "../../../tools/babylon/logistics/types.js"
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

	#getStyle(tile: GlobalTileVec2) {
		const {cell} = this.layout.lookupTile(tile)
		const key = this.styleKeyByCell.require(cell)
		return this.assets.styles.require(key)
	}

	#makeSpawner(cargo: Cargo, spatial: Partial<Spatial>) {
		return () => cargo.instance(spatial)
	}

	#createFlooring() {
		for (const tile of this.layout.floorTiles.values()) {
			const style = this.#getStyle(tile)

			const radians = Degrees.toRadians(this.randy.choose([0, -90, -180, -270]))
			const cargo = style.floors.require("1x1")()
			const spatial = this.placer.placeProp({location: tile, radians})
			const spawn = this.#makeSpawner(cargo, spatial)

			const subject = new CullingSubject(tile, spawn)
			this.cullableGrid.add(subject)
		}
	}

	#createWalls() {
		// for (const tile of this.layout.wallTiles.values()) {
		// 	const style = this.#getStyle(tile)
		// }
	}

	dispose() {
		this.cullableGrid.dispose()
		this.fadingGrid.dispose()
	}
}

