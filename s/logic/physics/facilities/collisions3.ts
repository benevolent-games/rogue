
import {Vec3} from "@benev/toolbox"

import {Box3} from "../shapes/box3.js"
import {Line3} from "../shapes/line3.js"
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

