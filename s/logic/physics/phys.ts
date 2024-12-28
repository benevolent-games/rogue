
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"

export type PhysShape = Box2 | Circle

export type BodyOptions = {
	shape: PhysShape
	mass: number
	updated: (body: PhysBody) => void
}

export class PhysBody {
	force = Vec2.zero()
	velocity = Vec2.zero()

	constructor(
		public shape: PhysShape,
		public mass: number,
		public updated: () => void,
		public dispose: () => void,
	) {}
}

export class PhysObstacle {
	constructor(
		public shape: PhysShape,
		public dispose: () => void,
	) {}
}

export class Phys {
	static collide(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Collisions2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Collisions2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Collisions2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Collisions2.circleVsCircle(a, b)
		return false
	}

	static intersect(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Intersections2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Intersections2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Intersections2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Intersections2.circleVsCircle(a, b)
		return null
	}

	damping = 20 / 100
	timeStep = 1 / 60

	bodies = new Set<PhysBody>()
	obstacles = new Set<PhysObstacle>()

	bodyGrid = new ZenGrid<PhysBody>(new Vec2(8, 8))
	obstacleGrid = new ZenGrid<PhysObstacle>(new Vec2(8, 8))

	makeBody(options: BodyOptions) {
		const box = options.shape.boundingBox()
		const body = new PhysBody(
			options.shape,
			options.mass,
			() => {
				zen.update()
				options.updated(body)
			},
			() => {
				zen.delete()
				this.bodies.delete(body)
			},
		)
		const zen = this.bodyGrid.create(box, body)
		this.bodies.add(body)
		return body
	}

	makeObstacle(shape: PhysShape) {
		const obstacle = new PhysObstacle(shape, () => {
			zen.delete()
			this.obstacles.delete(obstacle)
		})
		const zen = this.obstacleGrid.create(shape.boundingBox(), obstacle)
		this.obstacles.add(obstacle)
		return obstacle
	}

	simulate() {
		this.#resolveOverlaps()

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
		for (const obstacle of this.obstacleGrid.select(body.shape.boundingBox())) {
			const intersection = Phys.intersect(body.shape, obstacle.shape)
			if (intersection)
				this.#resolveIntersection(body, intersection)
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

	#resolveOverlaps() {
		// resolve body vs obstacle overlaps
		for (const body of this.bodies) {
			for (const obstacle of this.obstacleGrid.select(body.shape.boundingBox())) {
				const intersection = Phys.intersect(body.shape, obstacle.shape)
				if (intersection) {
					this.#resolveObstacleOverlap(body, intersection)
				}
			}
		}

		// resolve body vs body overlaps
		for (const body of this.bodies) {
			for (const otherBody of this.bodyGrid.select(body.shape.boundingBox())) {
				if (body === otherBody) continue
				const intersection = Phys.intersect(body.shape, otherBody.shape)
				if (intersection) {
					this.#resolveBodyOverlap(body, intersection, otherBody)
				}
			}
		}
	}

	#resolveObstacleOverlap(body: PhysBody, intersection: Intersection) {
		const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)
		body.shape.offset(mtv) // push body out of the obstacle
	}

	#resolveBodyOverlap(body: PhysBody, intersection: Intersection, otherBody: PhysBody) {
		const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)

		// split resolution proportionally by mass
		const totalMass = body.mass + otherBody.mass
		const bodyPush = mtv.clone().multiplyBy(otherBody.mass / totalMass)
		const otherPush = mtv.clone().multiplyBy(-body.mass / totalMass)

		body.shape.offset(bodyPush)
		otherBody.shape.offset(otherPush)
	}
}

