
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

export function vectorHash(vector: Vec2) {
	return `${vector.x},${vector.y}`
}

export class Gridzone {

	/** get the zone coordinates that contains the given vector */
	static getZoneVectorThatContainsPoint(point: Vec2, zoneExtent: Vec2) {
		return new Vec2(
			Math.floor(point.x / zoneExtent.x),
			Math.floor(point.y / zoneExtent.y),
		)
	}

	/** the center coordinate of this zone */
	center: Vec2

	/** known vectors that are located within this zone */
	children: Vec2[] = []

	constructor(

			/** the south-west corner of the zone */
			public vector: Vec2,

			/** the size of the zone */
			public extent: Vec2,
		) {

		this.center = vector.clone()
			.multiply(extent)
			.add(extent.clone().half())
	}
}

export class Hashgrid {
	#zoneSize: number
	#zoneExtent: Vec2
	#zones = new Map2<string, Gridzone>()

	constructor(zoneSize: number) {
		this.#zoneSize = zoneSize
		this.#zoneExtent = new Vec2(zoneSize, zoneSize)
	}

	/** organize vectors into hashgrid zones */
	add(...points: Vec2[]) {
		const extent = this.#zoneExtent
		for (const point of points) {
			const zoneVector = Gridzone.getZoneVectorThatContainsPoint(point, extent)
			const hash = vectorHash(zoneVector)
			const zone = this.#zones.guarantee(hash, () => new Gridzone(zoneVector, extent))
			zone.children.push(point)
		}
	}

	/** get an iterator for the grid zones */
	getZones() {
		return this.#zones.values()
	}

	// /** return all grid zones near the point */
	// zonesNear(point: Vec2, radius: number) {
	// 	radius += 2
	// 	const {x, y} = point
	// 	const size = this.#zoneSize
	// 	const xMin = Math.floor((x - radius) / size)
	// 	const xMax = Math.floor((x + radius) / size)
	// 	const yMin = Math.floor((y - radius) / size)
	// 	const yMax = Math.floor((y + radius) / size)
	//
	// 	const zones: Gridzone[] = []
	//
	// 	for (let zoneX = xMin; zoneX <= xMax; zoneX++) {
	// 		for (let zoneY = yMin; zoneY <= yMax; zoneY++) {
	// 			const key = `${zoneX},${zoneY}`
	// 			const zone = this.#zones.get(key)
	// 			if (zone)
	// 				zones.push(zone)
	// 		}
	// 	}
	//
	// 	return zones
	// }

	zonesNear(point: Vec2, radius: number) {
		const r2 = (radius * 2) ** 2
		return [...this.getZones()]
			.filter(zone => zone.center.distanceSquared(point) <= r2)
	}

	/** return all vectors near the point */
	near(point: Vec2, radius: number) {
		const r2 = (radius + 2) ** 2
		return this.zonesNear(point, radius * 2)
			.flatMap(zone => zone.children)
			.filter(tile => tile.distanceSquared(point) <= r2)
	}

	nearOg(point: Vec2, radius: number) {
		radius += 2
		const {x, y} = point
		const size = this.#zoneSize
		const xMin = Math.floor((x - radius) / size)
		const xMax = Math.floor((x + radius) / size)
		const yMin = Math.floor((y - radius) / size)
		const yMax = Math.floor((y + radius) / size)

		const resultsFromZones: Vec2[] = []

		for (let zoneX = xMin; zoneX <= xMax; zoneX++) {
			for (let zoneY = yMin; zoneY <= yMax; zoneY++) {
				const key = `${zoneX},${zoneY}`
				const zone = this.#zones.get(key)
				if (zone)
					resultsFromZones.push(...zone.children)
			}
		}

		const d2 = radius ** 2
		return resultsFromZones.filter(tile => tile.distanceSquared(point) <= d2)
	}
}

