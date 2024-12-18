
import {Vec3} from "@benev/toolbox"

export class Box3 {
	constructor(
		public min: Vec3,
		public extent: Vec3,
	) {}

	static centered(center: Vec3, extent: Vec3) {
		const min = center.clone().subtract(extent.clone().half())
		return new this(min, extent)
	}

	get center() {
		return this.min.clone()
			.add(this.extent.clone().half())
	}

	get max() {
		return this.min.clone()
			.add(this.extent)
	}

	clone() {
		return new Box3(this.min.clone(), this.extent.clone())
	}

	grow(increase: number) {
		this.min.subtract(Vec3.all(increase))
		this.extent.add(Vec3.all(increase * 2))
		return this
	}
}

