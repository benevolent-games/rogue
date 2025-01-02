
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {projectOnto} from "./utils/project-onto.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"

export type Mass = number | null
export type PhysShape = Box2 | Circle

export type PartOptions = {
	shape: PhysShape
	mass: Mass
}

export type BodyOptions = {
	parts: PartOptions[]
	updated: (body: PhysBody) => void
}

export class PhysPart {
	static make = (options: PartOptions) =>
		new this(options.shape, options.mass)

	constructor(
		public shape: PhysShape,
		public mass: Mass,
	) {}

	clone() {
		return new PhysPart(this.shape.clone(), this.mass)
	}
}

export class PhysBody {
	velocity = Vec2.zero()
	parts: [PhysPart, Vec2][]

	mass: Mass
	box: Box2

	constructor(
			parts: PhysPart[],
			public updated: () => void,
			public dispose: () => void,
		) {

		this.box = this.#computeBox(parts)
		this.mass = this.#computeMass(parts)

		this.parts = parts.map(part => [
			part,
			part.shape.center.clone().subtract(this.box.center),
		])
	}

	/** compute the mass of all parts combined */
	#computeMass(parts: PhysPart[]) {
		let mass: Mass = 0
		for (const part of parts) {
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

	/** compute the bounding box that subsumes all parts */
	#computeBox(parts: PhysPart[]) {
		const boxes = parts.map(p => p.shape.boundingBox())
		const min = Vec2.min(...boxes.map(b => b.min))
		const max = Vec2.max(...boxes.map(b => b.max))
		const extent = max.clone().subtract(min)
		return Box2.fromCorner(min, extent)
	}

	get absoluteParts() {
		return this.parts.map(([relativePart, offset]) => {
			const absolutePart = relativePart.clone()
			absolutePart.shape.center.add(offset)
			return absolutePart
		})
	}

	impulse(vector: Vec2) {
		if (this.mass === null)
			return
		this.velocity.add(
			vector.clone().divideBy(this.mass)
		)
	}

	offset(vector: Vec2) {
		for (const [part] of this.parts)
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

	fixedBodies = new Set<PhysBody>()
	dynamicBodies = new Set<PhysBody>()

	makeBody(options: BodyOptions) {
		const parts = options.parts.map(PhysPart.make)
		const updated = () => {
			zen.update()
			options.updated(body)
		}
		const dispose = () => {
			zen.delete()
			this.bodies.delete(body)
			this.dynamicBodies.delete(body)
			this.fixedBodies.delete(body)
		}

		const body = new PhysBody(parts, updated, dispose)
		const zen = this.bodyGrid.create(body.box, body)
		this.bodies.add(body)

		if (body.mass === null)
			this.fixedBodies.add(body)
		else
			this.dynamicBodies.add(body)

		return body
	}

	queryBodies(box: Box2) {
		return this.bodyGrid.queryItems(box)
	}

	simulate() {
		this.#resolveOverlaps()
		for (const body of this.dynamicBodies) {
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
		for (const body of this.dynamicBodies) {
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
		for (const partA of bodyA.absoluteParts) {
			for (const partB of bodyB.absoluteParts) {
				const intersection = Phys.intersect(partA.shape, partB.shape)
				if (intersection)
					intersections.push(intersection)
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

