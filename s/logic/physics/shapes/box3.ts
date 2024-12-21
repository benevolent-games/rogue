
import {Vec3} from "@benev/toolbox"

export class Box3 {
	constructor(
			public center: Vec3,
			public extent: Vec3,
		) {
		if (extent.x < 0 || extent.y < 0 || extent.z < 0)
			throw new Error(`invalid negative extent, ${extent.toString()}`)
	}

	static fromCorner(min: Vec3, extent: Vec3) {
		return new this(
			min.clone().add(extent.clone().half()),
			extent,
		)
	}

	get min() {
		return this.center.clone()
			.subtract(this.extent.clone().half())
	}

	get max() {
		return this.center.clone()
			.add(this.extent.clone().half())
	}

	clone() {
		return new Box3(this.center.clone(), this.extent.clone())
	}

	grow(increase: number) {
		this.extent.addBy(increase)
		return this
	}
}

