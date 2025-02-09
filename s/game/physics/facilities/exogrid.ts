//
// import {Map2} from "@benev/slate"
// import {Vec2} from "@benev/toolbox"
// import {Box2} from "../shapes/box2.js"
// import {Circle} from "../shapes/circle.js"
// import {Collisions2} from "./collisions2.js"
//
// export class Exozone<X> extends Box2 {
// 	items = new Set<X>()
// }
//
// export class Exogrid<X> {
// 	#zones = new Map2<string, Exozone<X>>()
// 	#zonesByItem = new Map2<X, Exozone<X>>()
//
// 	constructor(
// 		private zoneExtent: Vec2,
// 		public locator: (item: X) => Vec2,
// 	) {}
//
// 	#hash({x, y}: Vec2) {
// 		return `${x},${y}`
// 	}
//
// 	#calculateZoneCorner(point: Vec2) {
// 		return new Vec2(
// 			Math.floor(point.x / this.zoneExtent.x),
// 			Math.floor(point.y / this.zoneExtent.y),
// 		).multiply(this.zoneExtent)
// 	}
//
// 	#obtainZoneForItem(item: X) {
// 		const point = this.locator(item)
// 		const zoneCorner = this.#calculateZoneCorner(point)
// 		const hash = this.#hash(zoneCorner)
// 		return this.#zones.guarantee(
// 			hash,
// 			() => new Exozone(
// 				zoneCorner.clone().add(this.zoneExtent.clone().half()),
// 				this.zoneExtent,
// 			),
// 		)
// 	}
//
// 	add(item: X) {
// 		const zone = this.#obtainZoneForItem(item)
// 		zone.items.add(item)
// 		this.#zonesByItem.set(item, zone)
// 		return zone
// 	}
//
// 	remove(item: X) {
// 		const zone = this.#zonesByItem.get(item)
// 		if (zone) {
// 			zone.items.delete(item)
// 			this.#zonesByItem.delete(item)
// 		}
// 	}
//
// 	update(item: X) {
// 		const oldZone = this.#zonesByItem.get(item)
// 		const newZone = this.#obtainZoneForItem(item)
// 		const isChanged = oldZone !== newZone
//
// 		if (isChanged && oldZone)
// 			oldZone.items.delete(item)
//
// 		if (isChanged) {
// 			newZone.items.add(item)
// 			this.#zonesByItem.set(item, newZone)
// 		}
// 	}
//
// 	zones() {
// 		return this.#zones.values()
// 	}
//
// 	getItemsTouchingShape(shape: Box2 | Circle) {
// 		const relevantZones = new Set<Exozone<X>>()
// 		const shapeBounds = shape.boundingBox()
//
// 		
//
// 		// // calculate the grid bounds of the shape
// 		// const shapeBounds = shape instanceof Circle
// 		// 	? new Box2(shape.center, new Vec2(shape.radius * 2, shape.radius * 2))
// 		// 	: shape
// 		// const minCorner = this.#calculateZoneCorner(shapeBounds.min)
// 		// const maxCorner = this.#calculateZoneCorner(shapeBounds.max)
// 		//
// 		// // iterate over all grid cells overlapping the shape's bounds
// 		// for (let x = minCorner.x; x <= maxCorner.x; x += this.zoneExtent.x) {
// 		// 	for (let y = minCorner.y; y <= maxCorner.y; y += this.zoneExtent.y) {
// 		// 		const zone = this.#zones.get(this.#hash(new Vec2(x, y)))
// 		// 		if (zone) relevantZones.add(zone)
// 		// 	}
// 		// }
// 		//
// 		// // collect items from relevant zones
// 		// const items = new Set<X>()
// 		// for (const zone of relevantZones) {
// 		// 	for (const item of zone.items) {
// 		// 		if (Collisions2.shapeVsShape(shape, item))
// 		// 			items.add(item)
// 		// 	}
// 		// }
// 		//
// 		// return Array.from(items)
// 	}
//
// 	getZonesTouchingShape(shape: Box2 | Circle) {
// 		const zones: Exozone<X>[] = []
//
// 		const check = (shape instanceof Circle)
// 			? (zone: Exozone<X>) => Collisions2.boxVsCircle(zone, shape)
// 			: (zone: Exozone<X>) => Collisions2.boxVsBox(zone, shape)
//
// 		for (const zone of this.zones())
// 			if (check(zone))
// 				zones.push(zone)
//
// 		return zones
// 	}
// }
//
