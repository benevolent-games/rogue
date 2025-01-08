
import {loop, Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {PhysBody} from "./parts/body.js"
import {PhysPart} from "./parts/part.js"
import {Circle} from "./shapes/circle.js"
import {constants} from "../../constants.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {BodyOptions, PhysShape} from "./parts/types.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"
import {collisionResponseFactors} from "./utils/collision-response-factors.js"

export class Phys {

	// TODO why are a/b flipped in some of the collide/intersect functions?

	static collide(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Collisions2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Collisions2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Collisions2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Collisions2.circleVsCircle(b, a)
		return false
	}

	static intersect(a: PhysShape, b: PhysShape) {
		if (a instanceof Box2 && b instanceof Box2) return Intersections2.boxVsBox(a, b)
		if (a instanceof Box2 && b instanceof Circle) return Intersections2.boxVsCircle(a, b)
		if (a instanceof Circle && b instanceof Box2) return Intersections2.boxVsCircle(b, a)
		if (a instanceof Circle && b instanceof Circle) return Intersections2.circleVsCircle(b, a)
		return null
	}

	damping = (20 / 100) / constants.game.physicsIterations
	timeStep = (1 / constants.game.tickRate) / constants.game.physicsIterations

	bodies = new Set<PhysBody>()
	fixedBodies = new Set<PhysBody>()
	dynamicBodies = new Set<PhysBody>()
	bodyGrid = new ZenGrid<PhysBody>(new Vec2(8, 8))

	#addBody(body: PhysBody) {
		this.bodies.add(body)
		if (body.mass === Infinity)
			this.fixedBodies.add(body)
		else
			this.dynamicBodies.add(body)
	}

	#deleteBody(body: PhysBody) {
		this.bodies.delete(body)
		this.dynamicBodies.delete(body)
		this.fixedBodies.delete(body)
	}

	makeBody(options: BodyOptions) {
		const parts = options.parts.map(PhysPart.make)
		const updated = () => {
			zen.update()
			options.updated(body)
		}
		const dispose = () => {
			zen.delete()
			this.#deleteBody(body)
		}
		const body = new PhysBody(parts, updated, dispose)
		const zen = this.bodyGrid.create(body.box, body)
		this.#addBody(body)
		return body
	}

	queryBodies(box: Box2) {
		return this.bodyGrid.queryItems(box)
	}

	simulate() {
		for (const _ of loop(constants.game.physicsIterations)) {
			for (const body of this.dynamicBodies) {
				this.#applyDamping(body)
				this.#integrate(body)
				this.#resolveCollisions(body)
				body.updated()
			}
		}
	}

	#applyDamping(body: PhysBody) {
		body.velocity.lerp(Vec2.zero(), this.damping)
	}

	#integrate(body: PhysBody) {
		const displacement = body.velocity.clone().multiplyBy(this.timeStep)
		body.box.center.add(displacement)
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

	#intersectBodies(bodyA: PhysBody, bodyB: PhysBody) {
		const intersections: Intersection[] = []
		for (const partA of bodyA.parts) {
			for (const partB of bodyB.parts) {
				const intersection = Phys.intersect(partA.shape, partB.shape)
				if (intersection)
					intersections.push(intersection)
			}
		}
		return intersections
	}

	#resolveBodyCollisions(bodyA: PhysBody, bodyB: PhysBody, intersections: Intersection[]) {
		let [biggestIntersection, ...otherIntersections] = intersections

		for (const intersection of otherIntersections)
			if (intersection.depth > biggestIntersection.depth)
				biggestIntersection = intersection

		const mtv = biggestIntersection.normalA.clone().multiplyBy(biggestIntersection.depth)
		this.#applyCollisionResponse(bodyA, bodyB, mtv)
	}

	#applyCollisionResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
		const [factorA, factorB] = collisionResponseFactors(bodyA.mass, bodyB.mass)

		const correctionA = mtv.clone().multiplyBy(factorA)
		const correctionB = mtv.clone().multiplyBy(-factorB)

		bodyA.offset(correctionA)
		bodyB.offset(correctionB)
	}
}

