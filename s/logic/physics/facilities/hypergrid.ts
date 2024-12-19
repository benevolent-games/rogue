
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Box2} from "../shapes/box2.js"
import {Circle} from "../shapes/circle.js"
import {Collisions2} from "./collisions2.js"

export class Hyperzone extends Box2 {
	points: Vec2[] = []
}

export class Hypergrid {
	#zones = new Map2<string, Hyperzone>()
	constructor(private zoneExtent: Vec2) {}

	#hash({x, y}: Vec2) {
		return `${x},${y}`
	}

	#calculateZoneCorner(point: Vec2) {
		return new Vec2(
			Math.floor(point.x / this.zoneExtent.x),
			Math.floor(point.y / this.zoneExtent.y),
		).multiply(this.zoneExtent)
	}

	add(point: Vec2) {
		const zoneCorner = this.#calculateZoneCorner(point)
		const hash = this.#hash(zoneCorner)
		const zone = this.#zones.guarantee(hash, () => new Hyperzone(zoneCorner, this.zoneExtent))
		zone.points.push(point)
		return zone
	}

	listZones() {
		return [...this.#zones.values()]
	}

	getZonesTouchingCircle(circle: Circle) {
		return this.listZones()
			.filter(zone => Collisions2.boxVsCircle(zone, circle))
	}
}

