
import {PartOptions, PhysShape} from "./types.js"

export class PhysPart {
	static make = (options: PartOptions) =>
		new this(options.shape, options.mass)

	constructor(
		public shape: PhysShape,
		public mass: number,
	) {}

	clone() {
		return new PhysPart(this.shape.clone(), this.mass)
	}
}

