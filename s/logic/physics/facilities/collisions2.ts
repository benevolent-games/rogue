
import {Scalar, Vec2} from "@benev/toolbox"

import {Box2} from "../shapes/box2.js"
import {Circle} from "../shapes/circle.js"

export const Collisions2 = {
	pointVsBox(point: Vec2, box: Box2) {
		return (
			point.x >= box.min.x &&
			point.x <= box.max.x &&
			point.y >= box.min.y &&
			point.y <= box.max.y
		)
	},

	pointVsCircle(point: Vec2, circle: Circle) {
		const dx = point.x - circle.center.x
		const dy = point.y - circle.center.y
		const distanceSquared = (dx ** 2) + (dy ** 2)
		return distanceSquared <= (circle.radius ** 2)
	},

	boxVsBox(boxA: Box2, boxB: Box2) {
		return !(
			boxA.max.x <= boxB.min.x ||
			boxA.min.x >= boxB.max.x ||
			boxA.max.y <= boxB.min.y ||
			boxA.min.y >= boxB.max.y
		)
	},

	boxVsCircle(box: Box2, circle: Circle) {
		const clamped = new Vec2(
			Scalar.clamp(circle.center.x, box.min.x, box.max.x),
			Scalar.clamp(circle.center.y, box.min.y, box.max.y),
		)
		const difference = circle.center.clone().subtract(clamped)
		const distanceSquared = (difference.x ** 2) + (difference.y ** 2)
		const radiusSquared = circle.radius ** 2
		return distanceSquared <= radiusSquared
	},

	circleVsCircle(circleA: Circle, circleB: Circle) {
		const dx = circleB.center.x - circleA.center.x
		const dy = circleB.center.y - circleA.center.y
		const distanceSquared = (dx ** 2) + (dy ** 2)
		const radiusSum = circleA.radius + circleB.radius
		return distanceSquared <= (radiusSum ** 2)
	},
}

