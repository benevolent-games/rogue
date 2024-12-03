
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

export class Hashgrid {
	#zoneSize: number
	#zones = new Map2<string, Vec2[]>()

	constructor(zoneSize: number) {
		this.#zoneSize = zoneSize
	}

	#hashcode({x, y}: Vec2): string {
		const zoneX = Math.floor(x / this.#zoneSize)
		const zoneY = Math.floor(y / this.#zoneSize)
		return `${zoneX},${zoneY}`
	}

	add(...vecs: Vec2[]) {
		for (const vec of vecs) {
			const hash = this.#hashcode(vec)
			const zone = this.#zones.guarantee(hash, () => [])
			zone.push(vec)
		}
	}

	near(point: Vec2, radius: number) {
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
					resultsFromZones.push(...zone)
			}
		}

		const d2 = radius ** 2
		return resultsFromZones.filter(tile => tile.distanceSquared(point) <= d2)
	}
}

