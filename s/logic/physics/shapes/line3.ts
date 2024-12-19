
import {Vec3} from "@benev/toolbox"

export class Line3 {
	constructor(
		public start: Vec3,
		public end: Vec3,
	) {}

	clone() {
		return new Line3(
			this.start.clone(),
			this.end.clone(),
		)
	}

	get vector() {
		return this.end.clone().subtract(this.start)
	}

	fromStart(length: number) {
		const direction = this.vector.normalize()
		return this.start.clone().add(direction.multiplyBy(length))
	}
}

