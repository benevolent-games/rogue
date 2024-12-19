
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {Hypergrid} from "./facilities/hypergrid.js"
import {Collisions2} from "./facilities/collisions2.js"

export class Physics {
	unwalkableHypergrid = new Hypergrid(Vec2.new(16, 16))

	resetUnwalkableHypergrid(vectors: Vec2[]) {
		this.unwalkableHypergrid = new Hypergrid(new Vec2(16, 16))
		vectors.forEach(v => this.unwalkableHypergrid.add(v))
	}

	/** returns false if the circle overlaps any unwalkable tiles */
	isWalkable(point: Vec2, radius: number) {
		const circle = new Circle(point, radius)
		const zones = this.unwalkableHypergrid.getZonesTouchingCircle(circle)
		const tiles = zones.flatMap(zone => zone.points)
		const tileExtent = new Vec2(1, 1)
		return !tiles.some(tile => Collisions2.boxVsCircle(
			new Box2(tile, tileExtent),
			circle,
		))
	}
}

