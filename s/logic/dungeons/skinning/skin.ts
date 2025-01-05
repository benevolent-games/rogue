
import {Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../layout.js"
import {Walling} from "./walls/walling.js"
import {Flooring} from "./floors/flooring.js"
import {planWalls} from "./walls/plan-walls.js"
import {Vecmap2} from "../layouting/vecmap2.js"
import {planFloor} from "./floors/plan-floor.js"
import {Lifeguard} from "../../../tools/babylon/optimizers/lifeguard.js"
import {GlobalCellVec2, GlobalTileVec2, LocalCellVec2} from "../layouting/space.js"

export class DungeonSkin {
	lifeguard = new Lifeguard()
	styleKeyByCell = new Vecmap2<LocalCellVec2, string>()

	randy: Randy
	assets: DungeonAssets
	flooring: Flooring
	walling: Walling

	constructor(
			public layout: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {

		this.randy = new Randy(layout.options.seed)
		this.assets = new DungeonAssets(container, this.randy)

		const styles = [...this.assets.styles.keys()]

		for (const cell of this.layout.floors.cells())
			this.styleKeyByCell.set(cell, this.randy.choose(styles))

		this.flooring = this.#createFlooring()
		this.walling = this.#createWalls()
	}

	#getStyleForCell(cell: GlobalCellVec2) {
		const key = this.styleKeyByCell.require(cell)
		return this.assets.styles.require(key)
	}

	#createFlooring() {
		const getFloorStyle = (tile: GlobalTileVec2) => {
			const {cell} = this.layout.floors.lookup.require(tile)
			return this.#getStyleForCell(cell)
		}

		const floorPlan = planFloor(
			this.randy,
			this.layout.floors.set,
			getFloorStyle,
		)

		return new Flooring(this.lifeguard, floorPlan)
	}

	#createWalls() {
		const getWallStyle = (tile: GlobalTileVec2) => {
			const {cell} = this.layout.walls.lookup.require(tile)
			return this.#getStyleForCell(cell)
		}

		const plan = planWalls(
			this.randy,
			this.layout.walls.set,
			this.layout.floors.set,
			getWallStyle,
		)

		return new Walling(this.lifeguard, plan, getWallStyle)
	}

	dispose() {}
}

