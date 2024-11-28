
import {loop2d, Vec2} from "@benev/toolbox"
import {cardinals, ordinals} from "../../../tools/directions.js"
import {distance, DistanceAlgo} from "../../../tools/distance.js"

/**
 * Operations pertaining to managing vectors on a 2d grid.
 *  - does not store any vectors
 *  - it's about operations related to the extent of the grid (the boundaries)
 */
export class Grid {
	constructor(public extent: Vec2) {}

	list() {
		return [...loop2d(this.extent.array())]
			.map(([x, y]) => new Vec2(x, y))
	}

	inBounds({x, y}: Vec2) {
		return (x >= 0 && x < this.extent.x && y >= 0 && y < this.extent.y)
	}

	neighbors(vec: Vec2) {
		return cardinals
			.map(c => vec.clone().add(c))
			.filter(v => this.inBounds(v))
	}

	ordinalNeighbors(vec: Vec2) {
		return ordinals
			.map(c => vec.clone().add(c))
			.filter(v => this.inBounds(v))
	}

	isNeighbor(a: Vec2, b: Vec2) {
		const diff = b.subtract(a)
		return cardinals.some(c => c.equals(diff))
	}

	nearby(a: Vec2, range: number, algo: DistanceAlgo = "euclidean") {
		return this.list().filter(b => distance(a, b, algo) <= range)
	}

	vacancies(occupied: Vec2[]) {
		return this.list().filter(v => !occupied.includes(v))
	}

	#borderReport({x, y}: Vec2, range: number) {
		const {extent} = this
		const north = (y >= (extent.y - range))
		const east = (x >= (extent.x - range))
		const south = (y < range)
		const west = (x < range)
		return {north, east, south, west}
	}

	isBorder(vec: Vec2, range = 1) {
		const b = this.#borderReport(vec, range)
		return b.north || b.east || b.south || b.west
	}

	isCorner(vec: Vec2, range = 1) {
		const {north, east, south, west} = this.#borderReport(vec, range)
		return (
			(north && west) ||
			(north && east) ||
			(south && west) ||
			(south && east)
		)
	}

	isDirectionalBorder(vec: Vec2, direction: Vec2, range = 1) {
		const [northCardinal, eastCardinal, southCardinal, westCardinal] = cardinals
		const {north, east, south, west} = this.#borderReport(vec, range)
		if (direction.equals(northCardinal)) return north
		if (direction.equals(eastCardinal)) return east
		if (direction.equals(southCardinal)) return south
		if (direction.equals(westCardinal)) return west
	}

	getBorders(range = 1) {
		return this.list().filter(v => this.isBorder(v, range))
	}

	excludeBorders(range = 1) {
		return this.list().filter(v => !this.isBorder(v, range))
	}

	percentageFn() {
		return (p: number) => ((p / 100) * (this.extent.x * this.extent.y))
	}
}

