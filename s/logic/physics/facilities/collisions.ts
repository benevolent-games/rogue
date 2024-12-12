
import {Scalar, Vec2} from "@benev/toolbox"
import {Box} from "../shapes/box.js"
import {Circle} from "../shapes/circle.js"

export const Collisions = {
	pointVsBox(point: Vec2, box: Box) {
		return (
			point.x >= box.corner.x &&
			point.x <= box.corner2.x &&
			point.y >= box.corner.y &&
			point.y <= box.corner2.y
		)
	},

	pointVsCircle(point: Vec2, circle: Circle) {
		const dx = point.x - circle.center.x
		const dy = point.y - circle.center.y
		const distanceSquared = (dx ** 2) + (dy ** 2)
		return distanceSquared <= (circle.radius ** 2)
	},

	boxVsBox(boxA: Box, boxB: Box) {
		return !(
			boxA.corner2.x <= boxB.corner.x ||
			boxA.corner.x >= boxB.corner2.x ||
			boxA.corner2.y <= boxB.corner.y ||
			boxA.corner.y >= boxB.corner2.y
		)
	},

	boxVsCircle(box: Box, circle: Circle) {
		const clamped = new Vec2(
			Scalar.clamp(circle.center.x, box.corner.x, box.corner2.x),
			Scalar.clamp(circle.center.y, box.corner.y, box.corner2.y),
		)

		const difference = circle.center.clone().subtract(clamped)
		const distanceSquared = (difference.x ** 2) + (difference.y ** 2)
		const radiusSquared = circle.radius ** 2

		return distanceSquared <= radiusSquared
	},
}

