
import {Vec2} from "@benev/toolbox"
import {Vecset2} from "../../vecset2.js"
import {AlgoParams} from "../../types.js"
import {Rectangle} from "../../../../../tools/rectangle.js"
import {distance, DistanceAlgo} from "../../../../../tools/distance.js"

export class Fattener {
	constructor(public walkables: Vecset2, public params: AlgoParams) {}

	makeRoom(center: Vec2, radius: number, algo: DistanceAlgo = "chebyshev") {
		const {tileGrid} = this.params
		this.walkables.add(
			...tileGrid.nearby(center, Math.round(radius), algo)
				.filter(v => !tileGrid.isBorder(v))
		)
	}

	makeGoalpostBulbs(goalposts: Vec2[]) {
		const {randy} = this.params
		for (const goal of goalposts) {
			randy.choose([
				() => {},
				() => this.makeRoom(goal, 1, "chebyshev"),
				() => this.makeRoom(goal, 2, randy.choose(["manhattan"])),
			])()
		}
	}

	knobbify({count, size}: {
			count: number,
			size: number
		}) {
		const {randy, tileGrid} = this.params
		for (const _ of Array(Math.floor(count))) {
			const knob = randy.choose(this.walkables.list())
			this.walkables.add(
				...tileGrid.nearby(
					knob,
					Math.round(size),
					randy.choose(["chebyshev", "euclidean", "manhattan"]),
				).filter(v => !tileGrid.isBorder(v))
			)
		}
	}

	shadow() {
		const {tileGrid} = this.params
		const shadowTiles = this.walkables.list()
			.flatMap(tile => {
				return [
					Vec2.new(1, 0),
					Vec2.new(0, 1),
					Vec2.new(1, 1),
				].map(step => {
					let shadow = tile.clone().add(step)
					if (tileGrid.isBorder(shadow))
						shadow = tile.clone().add(step.multiplyBy(-1))
					return shadow
				})
			})
			.filter(tile => !tileGrid.isBorder(tile))
		this.walkables.add(...shadowTiles)
		return this
	}

	grow(count: number) {
		const {tileGrid, randy} = this.params
		for (const _ of Array(Math.floor(count))) {
			const target = randy.choose(this.walkables.list())
			const neighbors = tileGrid.neighbors(target)
				.filter(v => !this.walkables.has(v))
				.filter(v => !tileGrid.isBorder(v))
			const chosen = randy.choose(neighbors)
			if (chosen)
				this.walkables.add(chosen)
		}
	}

	// growBorderPortals(
	// 		range: [number, number],
	// 		[start, backwardDirection]: [Vec2, Vec2 | null],
	// 		[end, forwardDirection]: [Vec2, Vec2 | null],
	// 	) {
	//
	// 	if (backwardDirection)
	// 		this.#growPortal(start, backwardDirection, range)
	//
	// 	if (forwardDirection)
	// 		this.#growPortal(end, forwardDirection, range)
	// }

	spawnRectangle(root: Vec2, sizeRange: [number, number], centered: boolean = false) {
		const {walkables, params: {randy, tileGrid}} = this
		const rectangle = new Rectangle(Vec2.new(
			randy.integerRange(...sizeRange),
			randy.integerRange(...sizeRange),
		))
		if (centered)
			rectangle.center(root)
		else
			rectangle.moveRandomlyOnto(randy, root)
		walkables.add(...rectangle.tiles.filter(tile => !tileGrid.isBorder(tile)))
	}

	makeBorderRooms({sizeRange}: {
			sizeRange: [number, number]
		}) {

		const {walkables} = this
		const {randy, tileGrid, start, end, previousCellDirection, nextCellDirection} = this.params

		const makeRoom = (rootTile: Vec2, direction: Vec2) => {
			const rectangle = new Rectangle(Vec2.new(
				randy.integerRange(...sizeRange),
				randy.integerRange(...sizeRange),
			))
			rectangle.moveRandomlyOnto(randy, rootTile)
			const roomTiles = rectangle.tiles.filter(tile => {
				return (
					(!tileGrid.isCorner(tile)) &&
					(!tileGrid.isBorder(tile) || tileGrid.isDirectionalBorder(tile, direction))
				)
			})
			walkables.add(...roomTiles)
		}

		if (previousCellDirection)
			makeRoom(start, previousCellDirection)

		if (nextCellDirection)
			makeRoom(end, nextCellDirection)
	}

	#growPortal(hole: Vec2, direction: Vec2, range: [number, number]) {
		const {tileGrid, randy} = this.params
		const growth = randy.integerRange(...range)
		const banned = new Vecset2(
			tileGrid.list().filter(v => (
				(tileGrid.isCorner(v)) ||
				(tileGrid.isBorder(v) && !tileGrid.isDirectionalBorder(v, direction))
			)),
		)
		const additions = tileGrid.list()
			.filter(v => !banned.has(v))
			.filter(v => distance(hole, v, "euclidean") <= growth)
		this.walkables.add(...additions)
	}
}

