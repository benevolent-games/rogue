
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {Warehouse} from "../../../tools/babylon/logistics/warehouse.js"
import {ManifestQuery} from "../../../tools/babylon/logistics/types.js"

export type DungeonSpawners = ReturnType<DungeonStyle["makeSpawners"]>

/** Props specific to a single style within a dungeon glb */
export class DungeonStyle {
	randy: Randy

	constructor(
			public seed: number,
			public style: string,
			public styleWarehouse: Warehouse,
		) {
		this.randy = new Randy(seed)
	}

	static extractFromContainer(seed: number, container: AssetContainer) {
		const dungeonWarehouse = Warehouse.from(container)

		// TODO is this a hack??
		for (const material of container.materials)
			material.backFaceCulling = true

		// each style has its own complete set of dungeon props, floors/walls/etc
		return new Map2(
			[...dungeonWarehouse.categorize("style")]
				.map(([style, styleWarehouse]) => [
					style,
					new DungeonStyle(seed, style, styleWarehouse),
				])
		)
	}

	#require(query: ManifestQuery) {
		return this.styleWarehouse.require(query).list()
	}

	makeSpawners = () => ({
		floor: (() => {
			const size1x1 = this.#require({label: "floor", size: "1x1"})
			const size2x2 = this.#require({label: "floor", size: "2x2"})
			const size3x3 = this.#require({label: "floor", size: "3x3"})
			return {
				size1x1: this.randy.choose(size1x1),
				size2x2: this.randy.choose(size2x2),
				size3x3: this.randy.choose(size3x3),
			}
		})(),

		wall: (() => {
			const wallWarehouse = this.styleWarehouse.require({label: "wall", size: true})
			const stumpsWarehouse = this.styleWarehouse.require({label: "wall", size: "0.5"})

			for (const stump of stumpsWarehouse)
				wallWarehouse.delete(stump)

			return {
				stump: () => this.randy.choose(stumpsWarehouse.list()),
				walls: new Map2<number, () => Cargo>(
					[...wallWarehouse.categorize("size").entries()]
						.map(([size, warehouse]) => [
							Number(size),
							() => this.randy.choose(warehouse.list()),
						])
				),
			}
		})(),

		concave: (() => {
			const cargos = this.#require({label: "concave"})
			return this.randy.choose(cargos)
		})(),

		convex: (() => {
			const cargos = this.#require({label: "convex"})
			return this.randy.choose(cargos)
		})(),
	})
}

