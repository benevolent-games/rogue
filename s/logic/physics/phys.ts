
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"

export type PhysShape = Box2 | Circle

export type BodyOptions = {
	parts: PhysPart[]
	updated: (body: PhysBody) => void
}

export class PhysPart {
	constructor(
		public shape: PhysShape,
		public mass: number | null,
	) {}
}

export class PhysBody {
	velocity = Vec2.zero()
	parts = new Set<PhysPart>()

	constructor(
		public updated: () => void,
		public dispose: () => void,
	) {}

	get mass() {
		let mass: number | null = 0
		for (const part of this.parts) {
			if (part.mass === null) {
				mass = null
				break
			}
			else {
				mass += part.mass
			}
		}
		return mass
	}

	get box() {
		const boxes = [...this.parts].map(p => p.shape.boundingBox())
		const min = Vec2.min(...boxes.map(b => b.min))
		const max = Vec2.max(...boxes.map(b => b.max))
		const extent = max.clone().subtract(min)
		return Box2.fromCorner(min, extent)
	}

	add(part: PhysPart) {
		this.parts.add(part)
	}

	remove(part: PhysPart) {
		this.parts.delete(part)
	}

	impulse(vector: Vec2) {
		if (this.mass === null)
			return
		this.velocity.add(
			vector.clone().divideBy(this.mass)
		)
	}

	offset(vector: Vec2) {
		for (const part of this.parts)
			part.shape.center.add(vector)
	}
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
	bodyGrid = new ZenGrid<PhysBody>(new Vec2(8, 8))

	makeBody(options: BodyOptions) {
		const body = new PhysBody(
			() => {
				zen.update()
				options.updated(body)
			},
			() => {
				zen.delete()
				this.bodies.delete(body)
			},
		)
		for (const part of options.parts)
			body.add(part)
		const zen = this.bodyGrid.create(body.box, body)
		this.bodies.add(body)
		return body
	}

	simulate() {
		this.#resolveOverlaps()

		for (const body of this.bodies) {
			this.#applyDamping(body)
			this.#integrate(body)
			this.#resolveCollisions(body)
			body.updated()
		}
	}

	#applyDamping(body: PhysBody) {
		body.velocity.lerp(Vec2.zero(), this.damping)
	}

	#integrate(body: PhysBody) {
		const displacement = body.velocity.clone().multiplyBy(this.timeStep)
		body.offset(displacement)
	}

	#resolveCollisions(body: PhysBody) {
		// for (const obstacle of this.obstacleGrid.queryItems(body.shape.boundingBox())) {
		// 	const intersection = Phys.intersect(body.shape, obstacle.shape)
		// 	if (intersection)
		// 		this.#resolveIntersection(body, intersection)
		// }
	}

	#resolveIntersection(body: PhysBody, intersection: Intersection, otherBody?: PhysBody) {
		// const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)
		// body.shape.offset(mtv)
		//
		// // adjust velocity along the collision normal
		// const velocityAlongNormal = body.velocity.dot(intersection.normalA)
		// if (velocityAlongNormal < 0) {
		// 	body.velocity.subtract(
		// 		intersection.normalA.clone().multiplyBy(velocityAlongNormal)
		// 	)
		// }
		//
		// // if dynamic collision, apply forces to the other body
		// if (otherBody) {
		// 	const impulse = mtv.clone().divideBy(2)
		// 	body.velocity.subtract(impulse)
		// 	otherBody.velocity.add(impulse)
		// }
	}

	#resolveOverlaps() {
		// // resolve body vs obstacle overlaps
		// for (const body of this.bodies) {
		// 	for (const obstacle of this.obstacleGrid.queryItems(body.shape.boundingBox())) {
		// 		const intersection = Phys.intersect(body.shape, obstacle.shape)
		// 		if (intersection) {
		// 			this.#resolveObstacleOverlap(body, intersection)
		// 		}
		// 	}
		// }
		//
		// // resolve body vs body overlaps
		// for (const body of this.bodies) {
		// 	for (const otherBody of this.bodyGrid.queryItems(body.shape.boundingBox())) {
		// 		if (body === otherBody) continue
		// 		const intersection = Phys.intersect(body.shape, otherBody.shape)
		// 		if (intersection) {
		// 			this.#resolveBodyOverlap(body, intersection, otherBody)
		// 		}
		// 	}
		// }
	}

	#resolveBodyOverlap(body: PhysBody, intersection: Intersection, otherBody: PhysBody) {
		// const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)
		//
		// // split resolution proportionally by mass
		// const totalMass = body.mass + otherBody.mass
		// const bodyPush = mtv.clone().multiplyBy(otherBody.mass / totalMass)
		// const otherPush = mtv.clone().multiplyBy(-body.mass / totalMass)
		//
		// body.shape.offset(bodyPush)
		// otherBody.shape.offset(otherPush)
	}
}

