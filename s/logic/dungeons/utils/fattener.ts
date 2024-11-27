
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {Vecset2} from "./vecset2.js"
import {distance} from "../../../tools/distance.js"

export class Fattener {
	#tiles = new Vecset2()

	get tiles() {
		return this.#tiles.list()
	}

	constructor(public randy: Randy, public grid: Grid, tiles: Vec2[]) {
		this.#tiles.add(...tiles)
	}

	knobbify(count: number, maxSize: number) {
		for (const _ of Array(Math.floor(count))) {
			const size = this.randy.between(1, maxSize)
			const knob = this.randy.choose(this.tiles)
			this.#tiles.add(
				...this.grid.nearby(
					knob,
					size,
					this.randy.choose(["chebyshev", "euclidean", "manhattan"]),
				).filter(v => !this.grid.isBorder(v))
			)
		}
	}

	grow(count: number) {
		for (const _ of Array(Math.floor(count))) {
			const target = this.randy.choose(this.tiles)
			const neighbors = this.grid.neighbors(target)
				.filter(v => !this.#tiles.has(v))
				.filter(v => !this.grid.isBorder(v))
			const chosen = this.randy.choose(neighbors)
			if (chosen)
				this.#tiles.add(chosen)
		}
	}

	growBorderHole(hole: Vec2, direction: Vec2, maxGrowth: number) {
		const {grid, randy} = this
		const growth = Math.floor(randy.between(1, maxGrowth + 1))
		console.log("G", growth)
		const banned = new Vecset2(
			grid.list().filter(v => (
				(grid.isCorner(v)) ||
				(grid.isBorder(v) && !grid.isDirectionalBorder(v, direction))
			)),
		)
		const additions = grid.list()
			.filter(v => !banned.has(v))
			.filter(v => distance(hole, v, "euclidean") <= growth)
		this.#tiles.add(...additions)
	}
}

