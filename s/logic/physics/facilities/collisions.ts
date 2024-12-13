
import {Scalar, Vec2, Vec3} from "@benev/toolbox"

import {Line3} from "../shapes/line.js"
import {Circle} from "../shapes/circle.js"
import {Box, Box3} from "../shapes/box.js"
import {Sausage3} from "../shapes/sausage.js"

export const Collisions3 = {
	lineVsBox(line: Line3, box: Box3) {
		const tMin = box.min.clone().subtract(line.start).divide(line.vector)
		const tMax = box.max.clone().subtract(line.start).divide(line.vector)
		const t1 = Vec3.min(tMin, tMax)
		const t2 = Vec3.max(tMin, tMax)
		const tNear = Math.max(t1.x, t1.y, t1.z, 0)
		const tFar = Math.min(t2.x, t2.y, t2.z, 1)
		return tNear <= tFar
	},

	sausageVsBox(sausage: Sausage3, box: Box3) {
		const fattenedBox = box.clone().grow(sausage.radius)
		return Collisions3.lineVsBox(sausage.line, fattenedBox)
	},

	boxVsBox(boxA: Box3, boxB: Box3) {
		const xOverlap = boxA.min.x <= boxB.max.x && boxA.max.x >= boxB.min.x
		const yOverlap = boxA.min.y <= boxB.max.y && boxA.max.y >= boxB.min.y
		const zOverlap = boxA.min.z <= boxB.max.z && boxA.max.z >= boxB.min.z
		return xOverlap && yOverlap && zOverlap
	},
}

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

