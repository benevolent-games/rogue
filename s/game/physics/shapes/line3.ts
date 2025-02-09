
import {Vec3} from "@benev/toolbox"

export class Line3 {
	constructor(
		public start: Vec3,
		public end: Vec3,
	) {}

	get vector() {
		return this.end.clone().subtract(this.start)
	}

	get length() {
		return this.start.distance(this.end)
	}

	get center() {
		return this.start.clone()
			.add(this.end)
			.divideBy(2)
	}

	clone() {
		return new Line3(
			this.start.clone(),
			this.end.clone(),
		)
	}

	fromStart(length: number) {
		const direction = this.vector.normalize()
		return this.start.clone().add(direction.multiplyBy(length))
	}

	point(fraction: number) {
		return this.start.clone().add(this.vector.multiplyBy(fraction))
	}

	scale(fraction: number) {
		const newHalfVector = this.vector.multiplyBy(fraction / 2)
		this.start.set(this.center.subtract(newHalfVector))
		this.end.set(this.center.add(newHalfVector))
	}
}

