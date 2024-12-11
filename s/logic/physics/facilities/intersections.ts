
import {Scalar, Vec2} from "@benev/toolbox"
import {Box} from "../shapes/box.js"
import {Circle} from "../shapes/circle.js"

export const Intersections = {
	pointInBox(point: Vec2, box: Box) {
		return (
			point.x >= box.corner.x &&
			point.x <= box.corner2.x &&
			point.y >= box.corner.y &&
			point.y <= box.corner2.y
		)
	},

	pointInCircle(point: Vec2, circle: Circle) {
		const difference = point.clone().subtract(circle.center)
		const distanceSquared = (difference.x ** 2) + (difference.y ** 2)
		return distanceSquared <= (circle.radius ** 2)
	},

	boxIntersectsBox(boxA: Box, boxB: Box) {
		return !(
			boxA.corner2.x <= boxB.corner.x ||
			boxA.corner.x >= boxB.corner2.x ||
			boxA.corner2.y <= boxB.corner.y ||
			boxA.corner.y >= boxB.corner2.y
		)
	},

	boxIntersectsCircle(box: Box, circle: Circle) {
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

