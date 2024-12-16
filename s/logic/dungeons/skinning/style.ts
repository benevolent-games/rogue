
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"

import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {Warehouse} from "../../../tools/babylon/logistics/warehouse.js"

export class DungeonStyle {
	floors: Map2<string, () => Cargo>
	walls: Map2<number, () => Cargo>

	convex: () => Cargo
	concave: () => Cargo

	constructor(
			public warehouse: Warehouse,
			public randy: Randy,
		) {

		const floors = warehouse.require({label: "floor", size: true})
		this.floors = new Map2(
			[...floors.categorize("size").entries()]
				.map(([size, warehouse]) => {
					const cargos = warehouse.list()
					return [size, () => this.randy.choose(cargos)]
				})
		)

		const convexes = warehouse.require({label: "convex"}).list()
		this.convex = () => randy.choose(convexes)

		const concaves = warehouse.require({label: "concave"}).list()
		this.concave = () => randy.choose(concaves)

		const walls = warehouse.require({label: "wall", size: true})
		const stumps = warehouse.require({label: "wall", size: "0.5"})

		// remove stumps from walls
		for (const stump of stumps)
			walls.delete(stump)

		this.walls = new Map2(
			[...walls.categorize("size").entries()]
				.map(([size, warehouse]) => {
					const cargos = warehouse.list()
					return [Number(size), () => this.randy.choose(cargos)]
				})
		)
	}
}

