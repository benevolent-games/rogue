
import {Box2} from "./box2.js"
import {Vec2} from "@benev/toolbox"

export class Circle {
	constructor(
		public center: Vec2,
		public radius: number,
	) {}

	offset(delta: Vec2) {
		this.center.add(delta)
		return this
	}

	boundingBox() {
		const extent = Vec2.all(this.radius * 2)
		return new Box2(this.center, extent)
	}

	clone() {
		return new Circle(this.center.clone(), this.radius)
	}
}

