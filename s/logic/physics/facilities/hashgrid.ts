
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

export class Gridzone {
	vectors: Vec2[] = []
	constructor(public hash: string) {}
}

export class Hashgrid {
	#zoneSize: number
	#zones = new Map2<string, Gridzone>()

	constructor(zoneSize: number) {
		this.#zoneSize = zoneSize
	}

	#hash({x, y}: Vec2): string {
		const zoneX = Math.floor(x / this.#zoneSize)
		const zoneY = Math.floor(y / this.#zoneSize)
		return `${zoneX},${zoneY}`
	}

	/** organize vectors into hashgrid zones */
	add(...vecs: Vec2[]) {
		for (const vec of vecs) {
			const hash = this.#hash(vec)
			const zone = this.#zones.guarantee(hash, () => new Gridzone(hash))
			zone.vectors.push(vec)
		}
	}

	/** get an iterator for the grid zones */
	getZones() {
		return this.#zones.values()
	}

	/** return all grid zones near the point */
	zonesNear(point: Vec2, radius: number) {
		radius += 2
		const {x, y} = point
		const size = this.#zoneSize
		const xMin = Math.floor((x - radius) / size)
		const xMax = Math.floor((x + radius) / size)
		const yMin = Math.floor((y - radius) / size)
		const yMax = Math.floor((y + radius) / size)

		const zones: Gridzone[] = []

		for (let zoneX = xMin; zoneX <= xMax; zoneX++) {
			for (let zoneY = yMin; zoneY <= yMax; zoneY++) {
				const key = `${zoneX},${zoneY}`
				const zone = this.#zones.get(key)
				if (zone)
					zones.push(zone)
			}
		}

		return zones
	}

	/** return all vectors near the point */
	near(point: Vec2, radius: number) {
		const d2 = radius ** 2
		return this.zonesNear(point, radius)
			.flatMap(zone => zone.vectors)
			.filter(tile => tile.distanceSquared(point) <= d2)
	}
}

