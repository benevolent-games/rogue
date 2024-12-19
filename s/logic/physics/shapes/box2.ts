
import {Vec2} from "@benev/toolbox"

export class Box2 {
	constructor(
		public corner: Vec2,
		public extent: Vec2,
	) {}

	get center() {
		return this.corner.clone()
			.add(this.extent.clone().half())
	}

	get corner2() {
		return this.corner.clone()
			.add(this.extent)
	}

	clone() {
		return new Box2(this.corner.clone(), this.extent.clone())
	}
}

