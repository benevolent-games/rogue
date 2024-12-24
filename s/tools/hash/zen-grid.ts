
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Box2} from "../../logic/physics/shapes/box2.js"
import {Collisions2} from "../../logic/physics/facilities/collisions2.js"

export class Zen {
	zones = new Set<ZenZone>()

	constructor(
		public grid: ZenGrid,
		public box: Box2,
	) {}

	update() {
		this.grid.update(this)
	}

	delete() {
		this.grid.delete(this)
	}
}

export class ZenZone extends Box2 {
	zens = new Set<Zen>()

	constructor(public hash: string, center: Vec2, extent: Vec2) {
		super(center, extent)
	}
}

export class ZenGrid {
	#zones = new Map2<string, ZenZone>()

	constructor(
		private zoneExtent: Vec2,
	) {}

	create(box: Box2) {
		const zen = new Zen(this, box)
		this.update(zen)
		return zen
	}

	update(zen: Zen) {
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

	delete(zen: Zen) {
		const emptyZones: ZenZone[] = []

		for (const zone of zen.zones) {
			zone.zens.delete(zen)
			if (zone.zens.size === 0)
				emptyZones.push(zone)
		}

		for (const emptyZone of emptyZones)
			this.#zones.delete(emptyZone.hash)
	}

	select(box: Box2) {
		const zones = this.#selectZones(box)
		const selected = new Set<Zen>()

		for (const zone of zones)
			for (const zen of zone.zens)
				if (Collisions2.boxVsBox(box, zen.box))
					selected.add(zen)

		return selected
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
		const zones = new Set<ZenZone>()
		const minZoneCorner = this.#calculateZoneCorner(box.min)
		const maxZoneCorner = this.#calculateZoneCorner(box.max)

		for (let x = minZoneCorner.x; x <= maxZoneCorner.x; x += this.zoneExtent.x)
			for (let y = minZoneCorner.y; y <= maxZoneCorner.y; y += this.zoneExtent.y)
				zones.add(this.#obtainZone(new Vec2(x, y)))

		return zones
	}
}

