
import {Vec2} from "@benev/toolbox"
import {Box} from "./shapes/box.js"
import {Circle} from "./shapes/circle.js"
import {Hashgrid} from "./facilities/hashgrid.js"
import {Intersections} from "./facilities/intersections.js"

export class Physics {
	unwalkableHashgrid = new Hashgrid(16)

	resetUnwalkableHashgrid(vectors: Vec2[]) {
		this.unwalkableHashgrid = new Hashgrid(16)
		this.unwalkableHashgrid.add(...vectors)
	}

	/** returns false if the circle overlaps any unwalkable tiles */
	isWalkable(point: Vec2, radius: number) {
		const circle = new Circle(point, radius)
		const tileExtent = new Vec2(1, 1)
		const nearby = this.unwalkableHashgrid.nearOg(point, radius)
		return !nearby.some(tile => Intersections.boxIntersectsCircle(
			new Box(tile, tileExtent),
			circle,
		))
	}
}

