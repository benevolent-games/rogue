
import {Vec2} from "@benev/toolbox"

import {PhysPart} from "./part.js"
import {Box2} from "../shapes/box2.js"

type PartOffsetFromBoxCenter = Vec2

export class PhysBody {
	velocity = Vec2.zero()
	box: Box2
	mass: number
	#internalParts: [PhysPart, PartOffsetFromBoxCenter][]

	constructor(
			parts: PhysPart[],
			public updated: () => void,
			public dispose: () => void,
		) {

		this.box = this.#computeBox(parts)
		this.mass = this.#computeMass(parts)

		this.#internalParts = parts.map(part => [
			part,
			part.shape.center
				.clone()
				.subtract(this.box.center),
		])
	}

	/** compute the mass of all parts combined */
	#computeMass(parts: PhysPart[]) {
		return parts.reduce((p, c) => p + c.mass, 0)
	}

	/** compute the bounding box that subsumes all parts */
	#computeBox(parts: PhysPart[]) {
		const boxes = parts.map(p => p.shape.boundingBox())
		const min = Vec2.min(...boxes.map(b => b.min))
		const max = Vec2.max(...boxes.map(b => b.max))
		const extent = max.clone().subtract(min)
		return Box2.fromCorner(min, extent)
	}

	get parts() {
		return this.#internalParts.map(([relativePart, offset]) => {
			const part = relativePart.clone()
			part.shape.center.set(
				this.box.center
					.clone()
					.add(offset)
			)
			return part
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
		this.box.center.add(vector)
		this.updated()
	}

	get inverseMass() {
		return this.mass === Infinity ? 0 : 1 / this.mass
	}
}

