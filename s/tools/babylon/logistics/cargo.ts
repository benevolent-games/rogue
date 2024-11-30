
import {Trashbin} from "@benev/slate"
import {Prop, Quat, Vec3} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {Spatial} from "./types.js"
import {Manifest} from "./manifest.js"

export class Cargo {
	trashbin = new Trashbin()

	constructor(public manifest: Manifest, public prop: Prop) {}

	instance(spatial?: Spatial) {
		const position = spatial?.position ?? Vec3.zero()
		const rotation = spatial?.rotation ?? Quat.identity()
		const scale = spatial?.scale ?? Vec3.zero()

		const instance = this.prop.instantiateHierarchy(
			undefined,
			undefined,
			(source, clone) => {
				clone.name = source.name
			},
		) as TransformNode

		instance.position.set(...position.array())
		instance.rotationQuaternion = new Quaternion().set(...rotation.array())
		instance.scaling.set(...scale.array())

		this.trashbin.disposable(instance)
		return instance
	}

	dispose() {
		this.trashbin.dispose()
	}
}

