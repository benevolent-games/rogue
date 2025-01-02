
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {PhysBody} from "./parts/body.js"
import {Circle} from "./shapes/circle.js"
import {PhysPart} from "./parts/part.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Collisions2} from "./facilities/collisions2.js"
import {BodyOptions, PhysShape} from "./parts/types.js"
import {Intersection, Intersections2} from "./facilities/intersections2.js"
import {collisionResponseFactors} from "./utils/collision-response-factors.js"

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
	fixedBodies = new Set<PhysBody>()
	dynamicBodies = new Set<PhysBody>()
	bodyGrid = new ZenGrid<PhysBody>(new Vec2(8, 8))

	#addBody(body: PhysBody) {
		this.bodies.add(body)
		if (body.mass === null)
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
		for (const body of this.dynamicBodies) {
			// this.#resolveOverlaps(body)
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

	// #resolveOverlaps(body: PhysBody) {
	// 	for (const otherBody of this.bodyGrid.queryItems(body.box)) {
	// 		if (body === otherBody) continue
	// 		const intersections = this.#intersectBodies(body, otherBody)
	// 		if (intersections.length > 0) {
	// 			this.#resolveBodyOverlaps(body, otherBody, intersections)
	// 		}
	// 	}
	// }

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

	#applyCollisionResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
		const [factorA, factorB] = collisionResponseFactors(bodyA.mass, bodyB.mass)

		const correctionA = mtv.clone().multiplyBy(factorA)
		const correctionB = mtv.clone().multiplyBy(-factorB)

		console.log(factorA)

		// bodyA.offset(correctionA)
		// bodyB.offset(correctionB)

		// const totalMass = (bodyA.mass ?? Infinity) + (bodyB.mass ?? Infinity)
		// const massA = bodyA.mass ?? Infinity
		// const massB = bodyB.mass ?? Infinity
		//
		// const correctionA = mtv.clone().multiplyBy(massB / totalMass)
		// const correctionB = mtv.clone().multiplyBy(-massA / totalMass)
		//
		// console.log({correctionA, correctionB})
		// debugger
		//
		// bodyA.offset(correctionA)
		// bodyB.offset(correctionB)
		//
		// // sliding mechanics
		// const relativeVelocity = bodyB.velocity.clone().subtract(bodyA.velocity)
		// const velocityAlongMTV = projectOnto(relativeVelocity, mtv)
		//
		// if (velocityAlongMTV.magnitude() > 0) {
		// 	const impulse = velocityAlongMTV.clone().divideBy(totalMass)
		// 	bodyA.velocity.add(impulse.clone().multiplyBy(-1))
		// 	bodyB.velocity.add(impulse)
		// }
	}

	// #applyCollisionResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
	// 	const massA = bodyA.mass ?? Infinity // Fixed bodies get "infinite" mass
	// 	const massB = bodyB.mass ?? Infinity
	// 	const totalMass = massA + massB
	//
	// 	// Handle corrections based on mass
	// 	const correctionA = massA === Infinity
	// 		? Vec2.zero() // Fixed body doesn't move
	// 		: mtv.clone().multiplyBy(massB / totalMass)
	//
	// 	const correctionB = massB === Infinity
	// 		? Vec2.zero() // Fixed body doesn't move
	// 		: mtv.clone().multiplyBy(-massA / totalMass)
	//
	// 	debugger
	//
	// 	// Apply positional corrections
	// 	bodyA.offset(correctionA)
	// 	bodyB.offset(correctionB)
	//
	// 	// Handle sliding mechanics
	// 	const relativeVelocity = bodyB.velocity.clone().subtract(bodyA.velocity)
	// 	const velocityAlongMTV = projectOnto(relativeVelocity, mtv)
	//
	// 	if (velocityAlongMTV.magnitude() > 0) {
	// 		// Only apply impulse to dynamic bodies
	// 		const impulse = velocityAlongMTV.clone().divideBy(totalMass)
	//
	// 		if (massA !== Infinity) {
	// 			bodyA.velocity.add(impulse.clone().multiplyBy(-1))
	// 		}
	// 		if (massB !== Infinity) {
	// 			bodyB.velocity.add(impulse)
	// 		}
	// 	}
	// }

	// #resolveBodyOverlaps(bodyA: PhysBody, bodyB: PhysBody, intersections: Intersection[]) {
	// 	for (const intersection of intersections) {
	// 		const mtv = intersection.normalA.clone().multiplyBy(intersection.depth)
	// 		this.#applyOverlapResponse(bodyA, bodyB, mtv)
	// 	}
	// }

	// #applyCollisionResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
	// 	const totalMass = (bodyA.mass ?? Infinity) + (bodyB.mass ?? Infinity)
	// 	const massA = bodyA.mass ?? Infinity
	// 	const massB = bodyB.mass ?? Infinity
	//
	// 	const correctionA = mtv.clone().multiplyBy(massB / totalMass)
	// 	const correctionB = mtv.clone().multiplyBy(-massA / totalMass)
	//
	// 	console.log({correctionA, correctionB})
	// 	debugger
	//
	// 	bodyA.offset(correctionA)
	// 	bodyB.offset(correctionB)
	//
	// 	// sliding mechanics
	// 	const relativeVelocity = bodyB.velocity.clone().subtract(bodyA.velocity)
	// 	const velocityAlongMTV = projectOnto(relativeVelocity, mtv)
	//
	// 	if (velocityAlongMTV.magnitude() > 0) {
	// 		const impulse = velocityAlongMTV.clone().divideBy(totalMass)
	// 		bodyA.velocity.add(impulse.clone().multiplyBy(-1))
	// 		bodyB.velocity.add(impulse)
	// 	}
	// }

	// #applyOverlapResponse(bodyA: PhysBody, bodyB: PhysBody, mtv: Vec2) {
	// 	const totalMass = (bodyA.mass ?? Infinity) + (bodyB.mass ?? Infinity)
	// 	const massA = bodyA.mass ?? Infinity
	// 	const massB = bodyB.mass ?? Infinity
	//
	// 	const correctionA = mtv.clone().multiplyBy(massB / totalMass)
	// 	const correctionB = mtv.clone().multiplyBy(-massA / totalMass)
	//
	// 	bodyA.offset(correctionA)
	// 	bodyB.offset(correctionB)
	// }
}

