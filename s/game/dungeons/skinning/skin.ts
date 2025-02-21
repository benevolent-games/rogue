
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

const preload = 50
const preloadMore = 100

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

		const useInstances = true

		for (const cargo of this.assets.warehouse.filter({label: "floor"}))
			this.lifeguard.pool(cargo, useInstances).preload(preload)

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

		const useInstances = false

		for (const cargo of this.assets.warehouse.filter({label: "wall"})) {
			this.lifeguard.pool(cargo, useInstances).preload(
				(cargo.manifest.get("size") === "0.5")
					? preloadMore
					: preload
			)
		}

		for (const cargo of this.assets.warehouse.filter({label: "convex"}))
			this.lifeguard.pool(cargo, useInstances).preload(preload)

		for (const cargo of this.assets.warehouse.filter({label: "concave"}))
			this.lifeguard.pool(cargo, useInstances).preload(preload)

		return new Walling(this.realm, this.lifeguard, plan, getWallStyle)
	}

	dispose() {
		this.lifeguard.dispose()
	}
}

