
import {loop2d, Vec2} from "@benev/toolbox"
import {cardinals} from "../../../tools/directions.js"
import {distance, DistanceAlgo} from "../../../tools/distance.js"

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

	nearby(a: Vec2, range: number, algo: DistanceAlgo = "euclidean") {
		return this.list().filter(b => distance(a, b, algo) <= range)
	}

	vacancies(occupied: Vec2[]) {
		return this.list().filter(v => !occupied.includes(v))
	}
}

