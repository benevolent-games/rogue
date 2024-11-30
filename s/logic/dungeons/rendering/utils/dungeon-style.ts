
import {Randy} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"

import {Cargo} from "../../../../tools/babylon/logistics/cargo.js"
import {Warehouse} from "../../../../tools/babylon/logistics/warehouse.js"
import {Spatial, ManifestQuery} from "../../../../tools/babylon/logistics/types.js"

export class DungeonStyle {
	randy = Randy.seed(1)
	trashbin = new Trashbin()

	constructor(
		public style: string,
		public styleWarehouse: Warehouse,
	) {}

	#query(search: ManifestQuery) {
		return this.styleWarehouse.query(search, true).list()
	}

	#instancer(cargo: Cargo) {
		return (spatial?: Spatial) => {
			const instance = cargo.instance(spatial)
			this.trashbin.disposable(instance)
			return instance
		}
	}

	makeSpawners = () => ({
		floor: (() => {
			const size1x1 = this.#query({part: "floor", size: "1x1"})
			const size2x2 = this.#query({part: "floor", size: "2x2"})
			const size3x3 = this.#query({part: "floor", size: "3x3"})
			return {
				size1x1: this.#instancer(this.randy.choose(size1x1)),
				size2x2: this.#instancer(this.randy.choose(size2x2)),
				size3x3: this.#instancer(this.randy.choose(size3x3)),
			}
		})(),

		wall: (() => {
			const size1 = this.#query({part: "wall", size: "1"})
			const sizeHalf = this.#query({part: "wall", size: "0.5"})
			return {
				size1: this.#instancer(this.randy.choose(size1)),
				sizeHalf: this.#instancer(this.randy.choose(sizeHalf)),
			}
		})(),

		concave: (() => {
			const cargos = this.#query({part: "concave"})
			return this.#instancer(this.randy.choose(cargos))
		})(),

		convex: (() => {
			const cargos = this.#query({part: "convex"})
			return this.#instancer(this.randy.choose(cargos))
		})(),
	})

	dispose() {
		this.trashbin.dispose()
	}
}

