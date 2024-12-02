
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {Vecset2} from "./vecset2.js"
import {distance, DistanceAlgo} from "../../../tools/distance.js"

export class Fattener {
	#tiles = new Vecset2()

	get tiles() {
		return this.#tiles.list()
	}

	constructor(public randy: Randy, public grid: Grid, tiles: Vec2[]) {
		this.#tiles.add(...tiles)
	}

	makeRoom(center: Vec2, radius: number, algo: DistanceAlgo = "chebyshev") {
		this.#tiles.add(
			...this.grid.nearby(center, Math.round(radius), algo)
				.filter(v => !this.grid.isBorder(v))
		)
	}

	makeGoalpostBulbs(goalposts: Vec2[]) {
		for (const goal of goalposts) {
			this.randy.choose([
				() => {},
				() => this.makeRoom(goal, 1, "chebyshev"),
				() => this.makeRoom(goal, 2, this.randy.choose(["manhattan"])),
			])()
		}
	}

	knobbify({count, size}: {
			count: number,
			size: number
		}) {
		for (const _ of Array(Math.floor(count))) {
			const knob = this.randy.choose(this.tiles)
			this.#tiles.add(
				...this.grid.nearby(
					knob,
					Math.round(size),
					this.randy.choose(["chebyshev", "euclidean", "manhattan"]),
				).filter(v => !this.grid.isBorder(v))
			)
		}
	}

	shadow() {
		this.#tiles.add(
			...this.tiles
				.map(tile => {
					let shadow = tile.clone().add_(1, 1)
					return (this.grid.isBorder(shadow))
						? tile.clone().add_(-1, -1)
						: shadow
				})
				.filter(tile => !this.grid.isBorder(tile))
		)
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

	growBorderPortals(
			range: [number, number],
			[start, backwardDirection]: [Vec2, Vec2 | null],
			[end, forwardDirection]: [Vec2, Vec2 | null],
		) {

		if (backwardDirection)
			this.#growPortal(start, backwardDirection, range)

		if (forwardDirection)
			this.#growPortal(end, forwardDirection, range)
	}

	#growPortal(hole: Vec2, direction: Vec2, range: [number, number]) {
		const {grid, randy} = this
		const growth = randy.integerRange(...range)
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

