
import {ob, Trashbin} from "@benev/slate"
import {Quat, Vec3} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export type Spatial = {
	position: Vec3
	rotation: Quat
	scale: Vec3
}

export type RawInstancerFn = () => TransformNode
export type BasketInstancerFn = (spatial?: Spatial) => TransformNode

export type RawInstancerFns = Record<string, RawInstancerFn>
export type BasketInstancerFns<RawFns extends RawInstancerFns> = {
	[K in keyof RawFns]: (spatial?: Partial<Spatial>) => TransformNode
}

export class Basket<RawFns extends RawInstancerFns> {
	trashbin = new Trashbin()
	instance: BasketInstancerFns<RawFns>

	constructor(fns: RawFns) {
		this.instance = ob(fns).map((fn): BasketInstancerFn => spatial => {
			const position = spatial?.position ?? Vec3.zero()
			const rotation = spatial?.rotation ?? Quat.identity()
			const scale = spatial?.scale ?? Vec3.zero()

			const instance = fn()
			instance.position.set(...position.array())
			instance.rotationQuaternion = new Quaternion().set(...rotation.array())
			instance.position.set(...scale.array())

			this.trashbin.disposable(instance)
			return instance
		}) as BasketInstancerFns<RawFns>
	}

	dispose() {
		this.trashbin.dispose()
	}
}

