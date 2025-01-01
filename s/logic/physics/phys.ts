
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {projectOnto} from "./utils/project-onto.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"

export type PhysShape = Box2 | Circle
export type Mass = number | null

export type PartOptions = {
	shape: PhysShape
	mass: Mass
}

export type BodyOptions = {
	shape: PhysShape
	mass: Mass
	updated: (body: PhysBody) => void
}

export class PhysPart {
	constructor(
		public shape: PhysShape,
		public mass: Mass,
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
		let mass: Mass = 0
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

	createPart(options: PartOptions) {
		const part = new PhysPart(options.shape, options.mass)
		return this.add(part)
	}

	add(part: PhysPart) {
		this.parts.add(part)
		return this
	}

	remove(part: PhysPart) {
		this.parts.delete(part)
		return this
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
		for (const part of options.parts) body.add(part)
		const zen = this.bodyGrid.create(body.box, body)
		this.bodies.add(body)
		return body
	}

	queryBodies(box: Box2) {
		return this.bodyGrid.queryItems(box)
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
		for (const otherBody of this.bodyGrid.queryItems(body.box)) {
			if (body === otherBody) continue
			const intersections = this.#intersectBodies(body, otherBody)
			if (intersections.length > 0) {
				this.#resolveBodyCollisions(body, otherBody, intersections)
			}
		}
	}

	#resolveOverlaps() {
		for (const body of this.bodies) {
			for (const otherBody of this.bodyGrid.queryItems(body.box)) {
				if (body === otherBody) continue
				const intersections = this.#intersectBodies(body, otherBody)
				if (intersections.length > 0) {
					this.#resolveBodyOverlaps(body, otherBody, intersections)
				}
			}
		}
	}

	#intersectBodies(bodyA: PhysBody, bodyB: PhysBody) {
		const intersections: Intersection[] = []
		for (const partA of bodyA.parts) {
			for (const partB of bodyB.parts) {
				const intersection = Phys.intersect(partA.shape, partB.shape)
				if (intersection) intersections.push(intersection)
			}
		}
		return intersections
	}

	#resolveBodyCollisions(bodyA: PhysBody, bodyB: PhysBody, intersections: Intersection[]) {
		let totalMTV = Vec2.zero()
		let totalDepth = 0

		for (const intersection of intersections) {
			totalMTV.add(intersection.normalA.clone().multiplyBy(intersection.depth))
			totalDepth += intersection.depth
		}

		if (totalDepth > 0) {
			const mtv = totalMTV.clone().divideBy(totalDepth)
			this.#applyCollisionResponse(bodyA, bodyB, mtv)
		}
	}

	#resolveBodyOverlaps(bodyA: PhysBody, bodyB: PhysBody, intersections: Intersection[]) {
		for (const intersection of intersections) {
			const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)
			this.#applyOverlapResponse(bodyA, bodyB, mtv)
		}
	}

	#applyCollisionResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
		const totalMass = (bodyA.mass || Infinity) + (bodyB.mass || Infinity)
		const massA = bodyA.mass || Infinity
		const massB = bodyB.mass || Infinity

		const correctionA = mtv.clone().multiplyBy(massB / totalMass)
		const correctionB = mtv.clone().multiplyBy(-massA / totalMass)

		bodyA.offset(correctionA)
		bodyB.offset(correctionB)

		// sliding mechanics
		const relativeVelocity = bodyB.velocity.clone().subtract(bodyA.velocity)
		const velocityAlongMTV = projectOnto(relativeVelocity, mtv)

		if (velocityAlongMTV.magnitude() > 0) {
			const impulse = velocityAlongMTV.clone().divideBy(totalMass)
			bodyA.velocity.add(impulse.clone().multiplyBy(-1))
			bodyB.velocity.add(impulse)
		}
	}

	#applyOverlapResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
		const totalMass = (bodyA.mass || Infinity) + (bodyB.mass || Infinity)
		const massA = bodyA.mass || Infinity
		const massB = bodyB.mass || Infinity

		const correctionA = mtv.clone().multiplyBy(massB / totalMass)
		const correctionB = mtv.clone().multiplyBy(-massA / totalMass)

		bodyA.offset(correctionA)
		bodyB.offset(correctionB)
	}
}

