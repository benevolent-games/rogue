
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {Exogrid} from "./facilities/exogrid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"

export type PhysShape = Box2 | Circle

export class PhysBody {
	velocity = Vec2.zero()
	force = Vec2.zero()
	updated: () => void

	constructor(
			public shape: PhysShape,
			public mass: number,
			updated: (body: PhysBody) => void
		) {
		this.updated = () => updated(this)
	}
}

export class PhysObstacle {
	constructor(public shape: PhysShape) {}
}

export class Phys {
	static makeGrid = <X>(locator: (item: X) => Vec2) =>
		new Exogrid<X>(new Vec2(16, 16), locator)

	static collide(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Collisions2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Collisions2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Collisions2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Collisions2.circleVsCircle(a, b)
	}

	static intersect(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Intersections2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Intersections2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Intersections2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Intersections2.circleVsCircle(a, b)
	}

	damping = 20 / 100
	timeStep = 1 / 60

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
		for (const body of this.bodies) {
			this.#applyForces(body)
			this.#integrate(body)
			this.#resolveCollisions(body)
			body.updated()
		}
	}

	#applyForces(body: PhysBody) {
		const acceleration = body.force.clone().divideBy(body.mass)
		body.velocity.add(acceleration)
		body.force.set_(0, 0) // reset forces after applying
		body.velocity.lerp(Vec2.zero(), this.damping)
	}

	#integrate(body: PhysBody) {
		const displacement = body.velocity.clone().multiplyBy(this.timeStep)
		body.shape.offset(displacement)
	}

	#resolveCollisions(body: PhysBody) {
		for (let i = 0; i < 10; i++) { // iterative resolution
			let resolved = true

			// check obstacle collisions
			for (const zone of this.obstacleGrid.getZonesTouchingShape(body.shape)) {
				for (const obstacle of zone.items) {
					const intersection = Phys.intersect(body.shape, obstacle.shape)
					if (intersection) {
						this.#resolveIntersection(body, intersection)
						resolved = false
					}
				}
			}

			// check body-body collisions
			for (const zone of this.bodyGrid.getZonesTouchingShape(body.shape)) {
				for (const otherBody of zone.items) {
					if (body === otherBody) continue
					const intersection = Phys.intersect(body.shape, otherBody.shape)
					if (intersection) {
						this.#resolveIntersection(body, intersection, otherBody)
						resolved = false
					}
				}
			}

			if (resolved) break
		}
	}

	#resolveIntersection(body: PhysBody, intersection: Intersection, otherBody?: PhysBody) {
		const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)
		body.shape.offset(mtv)

		// adjust velocity along the collision normal
		const velocityAlongNormal = body.velocity.dot(intersection.normalA)
		if (velocityAlongNormal < 0) {
			body.velocity.subtract(
				intersection.normalA.clone().multiplyBy(velocityAlongNormal)
			)
		}

		// if dynamic collision, apply forces to the other body
		if (otherBody) {
			const impulse = mtv.clone().divideBy(2)
			body.velocity.subtract(impulse)
			otherBody.velocity.add(impulse)
		}
	}
}

