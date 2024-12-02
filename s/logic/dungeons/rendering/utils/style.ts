
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Warehouse} from "../../../../tools/babylon/logistics/warehouse.js"
import {ManifestQuery} from "../../../../tools/babylon/logistics/types.js"

export type DungeonSpawners = ReturnType<DungeonStyle["makeSpawners"]>

/** Props specific to a single style within a dungeon glb */
export class DungeonStyle {
	randy = Randy.seed(1)

	constructor(
		public style: string,
		public styleWarehouse: Warehouse,
	) {}

	static extractFromContainer(container: AssetContainer) {
		const dungeonWarehouse = Warehouse.from(container)

		// each style has its own complete set of dungeon props, floors/walls/etc
		return new Map2(
			[...dungeonWarehouse.categorize("style")]
				.map(([style, styleWarehouse]) => [
					style,
					new DungeonStyle(style, styleWarehouse),
				])
		)
	}

	#query(search: ManifestQuery) {
		return this.styleWarehouse.query(search, true).list()
	}

	makeSpawners = () => ({
		floor: (() => {
			const size1x1 = this.#query({part: "floor", size: "1x1"})
			const size2x2 = this.#query({part: "floor", size: "2x2"})
			const size3x3 = this.#query({part: "floor", size: "3x3"})
			return {
				size1x1: this.randy.choose(size1x1),
				size2x2: this.randy.choose(size2x2),
				size3x3: this.randy.choose(size3x3),
			}
		})(),

		wall: (() => {
			const size1 = this.#query({part: "wall", size: "1"})
			const sizeHalf = this.#query({part: "wall", size: "0.5"})
			return {
				size1: this.randy.choose(size1),
				sizeHalf: this.randy.choose(sizeHalf),
			}
		})(),

		concave: (() => {
			const cargos = this.#query({part: "concave"})
			return this.randy.choose(cargos)
		})(),

		convex: (() => {
			const cargos = this.#query({part: "convex"})
			return this.randy.choose(cargos)
		})(),
	})
}

