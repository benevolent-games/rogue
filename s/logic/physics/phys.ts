
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {Exogrid} from "./facilities/exogrid.js"
import {Collisions2} from "./facilities/collisions2.js"

export type PhysShape = Box2 | Circle

export class PhysBody {
	energy = Vec2.zero()
	updated: (body: PhysBody) => void
	constructor(
			public shape: PhysShape,
			public mass: number,
			updated: (body: PhysBody) => void
		) {
		this.updated = updated
	}
}

export class PhysObstacle {
	constructor(public shape: PhysShape) {}
}

export class Phys {
	static makeGrid = <X>(locator: (item: X) => Vec2) => new Exogrid<X>(new Vec2(16, 16), locator)
	static shapeVsShape(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Collisions2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Collisions2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Collisions2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Collisions2.circleVsCircle(a, b)
	}

	damping = 20 / 100

	bodies = new Set<PhysBody>()
	obstacles = new Set<PhysObstacle>()

	bodyGrid = Phys.makeGrid<PhysBody>(d => d.shape.center)
	obstacleGrid = Phys.makeGrid<PhysObstacle>(o => o.shape.center)

	addBody(body: PhysBody) {
		this.bodies.add(body)
		this.bodyGrid.add(body)
		return () => {
			this.bodies.delete(body)
			this.bodyGrid.remove(body)
		}
	}

	addObstacle(obstacle: PhysObstacle) {
		this.obstacles.add(obstacle)
		this.obstacleGrid.add(obstacle)
		return obstacle
	}

	simulate() {
		for (const body of this.bodies)
			this.#simulateBody(body)

		for (const body of this.bodies)
			body.updated(body)
	}

	#simulateBody(body: PhysBody) {
		body.energy.lerp(Vec2.zero(), this.damping)

		const velocity = body.energy.clone().divideBy(body.mass)
		const projection = body.shape.clone().offset(velocity)

		if (!this.#bodyCollidesWithObstacle(projection))
			body.shape.offset(velocity)
	}

	#bodyCollidesWithObstacle(projection: PhysShape) {
		for (const zone of this.obstacleGrid.zones()) {
			if (Phys.shapeVsShape(zone, projection)) {
				for (const obstacle of zone.items) {
					if (Phys.shapeVsShape(obstacle.shape, projection))
						return true
				}
			}
		}
		return false
	}
}

