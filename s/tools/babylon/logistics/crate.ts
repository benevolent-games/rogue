
import {Prop} from "@benev/toolbox"

import {Spatial} from "./types.js"
import {applySpatial} from "./apply-spatial.js"

/** A 3d prop that we can instance */
export class Crate {
	constructor(public prop: Prop) {}

	instance(spatial: Partial<Spatial> = {}): Prop {
		const instance = this.prop.instantiateHierarchy(
			undefined,
			undefined,
			(source, clone) => {
				clone.name = source.name
			},
		)!
		applySpatial(instance, spatial)
		return instance
	}

	clone(spatial: Partial<Spatial> = {}): Prop {
		const clone = this.prop.clone("crate-clone", null)!
		applySpatial(clone, spatial)
		return clone
	}
}

