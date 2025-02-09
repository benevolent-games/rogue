
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Box2} from "../../game/physics/shapes/box2.js"
import {Collisions2} from "../../game/physics/facilities/collisions2.js"

export class Zen<X> {
	zones = new Set<ZenZone<X>>()

	constructor(
		public grid: ZenGrid<X>,
		public box: Box2,
		public item: X,
	) {}

	update() {
		this.grid.update(this)
	}

	delete() {
		this.grid.delete(this)
	}
}

export class ZenZone<X> extends Box2 {
	zens = new Set<Zen<X>>()

	constructor(public hash: string, center: Vec2, extent: Vec2) {
		super(center, extent)
	}
}

export class ZenGrid<X> {
	#zones = new Map2<string, ZenZone<X>>()

	constructor(private zoneExtent: Vec2) {}

	create(box: Box2, item: X) {
		const zen = new Zen<X>(this, box, item)
		this.update(zen)
		return zen
	}

	update(zen: Zen<X>) {
		const wantedZones = this.#selectZones(zen.box)

		// delete stale zones
		for (const zone of zen.zones) {
			if (!wantedZones.has(zone)) {
				zen.zones.delete(zone)
				zone.zens.delete(zen)
			}
		}

		// add fresh zones
		for (const zone of wantedZones) {
			if (!zen.zones.has(zone)) {
				zone.zens.add(zen)
				zen.zones.add(zone)
			}
		}
	}

	delete(zen: Zen<X>) {
		const emptyZones: ZenZone<X>[] = []

		for (const zone of zen.zones) {
			zone.zens.delete(zen)
			if (zone.zens.size === 0)
				emptyZones.push(zone)
		}

		for (const emptyZone of emptyZones)
			this.#zones.delete(emptyZone.hash)
	}

	check(box: Box2) {
		const zones = this.#selectZones(box)

		for (const zone of zones)
			for (const zen of zone.zens)
				if (Collisions2.boxVsBox(box, zen.box))
					return true

		return false
	}

	/** return all zens that touch the given box */
	query(box: Box2) {
		const zones = this.#selectZones(box)
		const selected: Zen<X>[] = []

		for (const zone of zones)
			for (const zen of zone.zens)
				if (Collisions2.boxVsBox(box, zen.box) && !selected.includes(zen))
					selected.push(zen)

		return selected
	}

	/** return all zen items that touch the given box */
	queryItems(box: Box2) {
		return this.query(box).map(zen => zen.item)
	}

	/** return all zen boxes that touch the given box */
	queryBoxes(box: Box2) {
		return this.query(box).map(zen => zen.box)
	}

	#hash(v: Vec2) {
		return `${v.x},${v.y}`
	}

	#calculateZoneCorner(point: Vec2) {
		return new Vec2(
			Math.floor(point.x / this.zoneExtent.x),
			Math.floor(point.y / this.zoneExtent.y),
		).multiply(this.zoneExtent)
	}

	#obtainZone(zoneCorner: Vec2) {
		const hash = this.#hash(zoneCorner)
		return this.#zones.guarantee(hash, () => new ZenZone(
			hash,
			zoneCorner.clone().add(this.zoneExtent.clone().half()),
			this.zoneExtent,
		))
	}

	#selectZones(box: Box2) {
		const zones = new Set<ZenZone<X>>()
		const minZoneCorner = this.#calculateZoneCorner(box.min)
		const maxZoneCorner = this.#calculateZoneCorner(box.max)

		for (let x = minZoneCorner.x; x <= maxZoneCorner.x; x += this.zoneExtent.x)
			for (let y = minZoneCorner.y; y <= maxZoneCorner.y; y += this.zoneExtent.y)
				zones.add(this.#obtainZone(new Vec2(x, y)))

		return zones
	}
}

