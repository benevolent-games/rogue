
import {Vec2} from "@benev/toolbox"
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
		// clamp the circle's center to the tile's bounds
		const clampedX = Math.max(tile.x, Math.min(point.x, tile.x + 1))
		const clampedY = Math.max(tile.y, Math.min(point.y, tile.y + 1))

		// calculate the distance from the circle's center to the clamped point
		const dx = point.x - clampedX
		const dy = point.y - clampedY

		// check if the distance is less than the circle's radius
		return (dx * dx + dy * dy) < (radius * radius)
	}
}

