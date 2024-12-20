
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Box2} from "../shapes/box2.js"
import {Circle} from "../shapes/circle.js"
import {Collisions2} from "./collisions2.js"

export class Exozone<X> extends Box2 {
	items: X[] = []
}

export class Exogrid<X> {
	#zones = new Map2<string, Exozone<X>>()
	#zonesByItem = new Map2<X, Exozone<X>>()

	constructor(
		private zoneExtent: Vec2,
		public locator: (item: X) => Vec2,
	) {}

	#hash({x, y}: Vec2) {
		return `${x},${y}`
	}

	#calculateZoneCorner(point: Vec2) {
		return new Vec2(
			Math.floor(point.x / this.zoneExtent.x),
			Math.floor(point.y / this.zoneExtent.y),
		).multiply(this.zoneExtent)
	}

	add(item: X) {
		const point = this.locator(item)
		const zoneCorner = this.#calculateZoneCorner(point)
		const hash = this.#hash(zoneCorner)
		const zone = this.#zones.guarantee(
			hash,
			() => new Exozone(zoneCorner, this.zoneExtent),
		)
		zone.items.push(item)
		this.#zonesByItem.set(item, zone)
		return zone
	}

	remove(item: X) {
		const zone = this.#zonesByItem.get(item)
		if (zone)
			zone.items = zone.items.filter(i => i !== item)
	}

	update(item: X) {
		this.remove(item)
		this.add(item)
	}

	zones() {
		return this.#zones.values()
	}

	getZonesTouchingCircle(circle: Circle) {
		const zones: Exozone<X>[] = []
		for (const zone of this.zones())
			if (Collisions2.boxVsCircle(zone, circle))
				zones.push(zone)
		return zones
	}
}

