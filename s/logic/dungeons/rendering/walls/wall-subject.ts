
import {Meshoid, Prop, Scalar, Vec2} from "@benev/toolbox"
import {CullingSubject} from "../culling/culling-subject.js"
import {getTopMeshes} from "../../../../tools/babylon/babylon-helpers.js"

export class WallSubject extends CullingSubject {
	meshes: Meshoid[] = []
	targetOpacity = 1
	currentOpacity = 1

	get done() {
		return this.currentOpacity === this.targetOpacity
	}

	constructor(location: Vec2, spawner: () => Prop) {
		super(location, spawner)
	}

	spawn() {
		super.spawn()
		this.meshes = getTopMeshes(this.prop!)
	}

	dispose() {
		super.dispose()
		this.meshes = []
	}

	animateOpacity(speed: number) {
		const newOpacity = (Math.abs(this.targetOpacity - this.currentOpacity) > (2 / 100))
			? Scalar.lerp(this.currentOpacity, this.targetOpacity, speed)
			: this.targetOpacity

		this.currentOpacity = newOpacity

		for (const mesh of this.meshes)
			mesh.visibility = newOpacity
	}
}

