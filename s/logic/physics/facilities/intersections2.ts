
import {Scalar, Vec2} from "@benev/toolbox"

import {Box2} from "../shapes/box2.js"
import {Circle} from "../shapes/circle.js"
import {Collisions2} from "./collisions2.js"

export class Intersection {
	constructor(
		public contactPoint: Vec2,
		public depth: number,
		public normalA: Vec2,
		public normalB: Vec2,
	) {}
}

export const Intersections2 = {
	boxVsBox(boxA: Box2, boxB: Box2) {
		if (!Collisions2.boxVsBox(boxA, boxB)) return null

		const overlapX = Math.min(boxA.max.x - boxB.min.x, boxB.max.x - boxA.min.x)
		const overlapY = Math.min(boxA.max.y - boxB.min.y, boxB.max.y - boxA.min.y)
		const depth = Math.min(overlapX, overlapY)

		const contactPoint = new Vec2(
			Scalar.clamp((boxA.center.x + boxB.center.x) / 2, boxB.min.x, boxB.max.x),
			Scalar.clamp((boxA.center.y + boxB.center.y) / 2, boxB.min.y, boxB.max.y)
		)

		const normalA = depth === overlapX
			? new Vec2(boxB.center.x > boxA.center.x ? -1 : 1, 0)
			: new Vec2(0, boxB.center.y > boxA.center.y ? -1 : 1)

		const normalB = normalA.clone().multiplyBy(-1)

		return new Intersection(contactPoint, depth, normalA, normalB)
	},

	boxVsCircle(box: Box2, circle: Circle) {
		if (!Collisions2.boxVsCircle(box, circle)) return null

		const clamped = new Vec2(
			Scalar.clamp(circle.center.x, box.min.x, box.max.x),
			Scalar.clamp(circle.center.y, box.min.y, box.max.y),
		)
		const difference = circle.center.clone().subtract(clamped)
		const distance = difference.magnitude()
		const depth = circle.radius - distance

		const contactPoint = clamped
		const normalA = difference.normalize()
		const normalB = normalA.clone().multiplyBy(-1)

		return new Intersection(contactPoint, depth, normalA, normalB)
	},

	circleVsCircle(circleA: Circle, circleB: Circle) {
		const dx = circleB.center.x - circleA.center.x
		const dy = circleB.center.y - circleA.center.y
		const distance = Math.sqrt(dx ** 2 + dy ** 2)
		if (distance >= circleA.radius + circleB.radius) return null

		const depth = circleA.radius + circleB.radius - distance

		const contactPoint = new Vec2(
			(circleA.center.x + circleB.center.x) / 2,
			(circleA.center.y + circleB.center.y) / 2
		)

		const normalA = new Vec2(dx / distance, dy / distance)
		const normalB = normalA.clone().multiplyBy(-1)

		return new Intersection(contactPoint, depth, normalA, normalB)
	},
}

