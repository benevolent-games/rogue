
import {Scalar, Vec2} from "@benev/toolbox"
import {Hashgrid} from "./facilities/hashgrid.js"

export class Physics {
	unwalkableHashgrid = new Hashgrid(16)

	resetUnwalkableHashgrid(vectors: Vec2[]) {
		this.unwalkableHashgrid = new Hashgrid(16)
		this.unwalkableHashgrid.add(...vectors)
	}

	/** returns false if the circle overlaps any unwalkable tiles */
	isWalkable(point: Vec2, radius: number) {
		const nearby = this.unwalkableHashgrid.near(point, radius)
		return !nearby.some(tile => this.#circleIntersectsSquare(point, radius, tile))
	}

	#circleIntersectsSquare(point: Vec2, radius: number, tile: Vec2) {
		const clampedX = Scalar.clamp(point.x, tile.x, tile.x + 1)
		const clampedY = Scalar.clamp(point.y, tile.y, tile.y + 1)
		const dx = point.x - clampedX
		const dy = point.y - clampedY
		const d2 = (dx ** 2) + (dy ** 2)
		const r2 = radius ** 2
		return d2 <= r2
	}
}

