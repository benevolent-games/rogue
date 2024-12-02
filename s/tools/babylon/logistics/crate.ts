
import {Prop} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {Spatial} from "./types.js"

/** A 3d prop that we can instance */
export class Crate {
	constructor(public prop: Prop) {}

	instance({position, rotation, scale}: Partial<Spatial> = {}) {
		const instance = this.prop.instantiateHierarchy(
			undefined,
			undefined,
			(source, clone) => {
				clone.name = source.name
			},
		) as TransformNode

		if (position)
			instance.position.set(...position.array())

		if (rotation)
			instance.rotationQuaternion = new Quaternion().set(...rotation.array())

		if (scale)
			instance.scaling.set(...scale.array())

		return instance
	}
}

