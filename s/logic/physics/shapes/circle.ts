
import {Box2} from "./box2.js"
import {Vec2} from "@benev/toolbox"

export class Circle {
	constructor(
		public center: Vec2,
		public radius: number,
	) {}

	boundingBox() {
		const radius = this.radius
		const doubleRadius = this.radius * 2
		const corner = this.center.clone().subtract_(radius, radius)
		const extent = corner.clone().add_(doubleRadius, doubleRadius)
		return new Box2(corner, extent)
	}
}

