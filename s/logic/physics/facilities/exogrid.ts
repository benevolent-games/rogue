
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Box2} from "../shapes/box2.js"
import {Circle} from "../shapes/circle.js"
import {Collisions2} from "./collisions2.js"
import { PhysShape } from "../phys.js"

export class Exozone<X> extends Box2 {
	items = new Set<X>()
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

	#calculateZoneForItem(item: X) {
		const point = this.locator(item)
		const zoneCorner = this.#calculateZoneCorner(point)
		const hash = this.#hash(zoneCorner)
		return this.#zones.guarantee(
			hash,
			() => new Exozone(
				zoneCorner.clone().add(this.zoneExtent.clone().half()),
				this.zoneExtent,
			),
		)
	}

	add(item: X) {
		const zone = this.#calculateZoneForItem(item)
		zone.items.add(item)
		this.#zonesByItem.set(item, zone)
		return zone
	}

	remove(item: X) {
		const zone = this.#zonesByItem.get(item)
		if (zone) {
			zone.items.delete(item)
			this.#zonesByItem.delete(item)
		}
	}

	update(item: X) {
		const oldZone = this.#zonesByItem.get(item)
		const newZone = this.#calculateZoneForItem(item)

		// delete from old zone
		if (oldZone && oldZone !== newZone)
			oldZone.items.delete(item)

		// add to new zone
		newZone.items.add(item)
		this.#zonesByItem.set(item, newZone)
	}

	zones() {
		return this.#zones.values()
	}

	getZonesTouchingShape(shape: Box2 | Circle) {
		const zones: Exozone<X>[] = []

		const check = (shape instanceof Circle)
			? (zone: Exozone<X>) => Collisions2.boxVsCircle(zone, shape)
			: (zone: Exozone<X>) => Collisions2.boxVsBox(zone, shape)

		for (const zone of this.zones())
			if (check(zone))
				zones.push(zone)

		return zones
	}
}

