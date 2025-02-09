
import {Trashbin} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Prop, Quat, Vec3} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {CoolMaterials} from "./cool-materials.js"
import {Crate} from "../../../tools/babylon/logistics/crate.js"
import {PropPool} from "../../../tools/babylon/optimizers/prop-pool.js"

const color = new Vec3(0, .7, .7)
const alpha = 0.5

const baseHeight = 5
const baseRadius = 1

export class DebugCapsules {
	#pool: PropPool
	#trash = new Trashbin()

	constructor(scene: Scene, public materials: CoolMaterials) {
		const height = baseHeight
		const radius = baseRadius

		const material = this.#trash.disposable(
			materials.create(...color.array(), alpha)
		)

		material.backFaceCulling = true
		material.disableLighting = true
		material.emissiveColor = material.albedoColor

		const mesh = this.#trash.disposable(
			MeshBuilder.CreateCapsule("debugcapsule", {height, radius}, scene)
		)
		mesh.material = material
		scene.removeMesh(mesh)

		const crate = new Crate(scene, mesh)
		this.#pool = new PropPool(crate, true)
		this.#pool.preload(10)
	}

	get(height: number, radius: number) {
		const prop = this.#pool.acquire()
		const dispose = () => this.#pool.release(prop)
		return new DebugCapsule(prop, height, radius, dispose)
	}

	dispose() {
		this.#pool.dispose()
	}
}

export class DebugCapsule {
	constructor(
			public prop: Prop,
			public height: number,
			public radius: number,
			public dispose: () => void,
		) {

		this.prop.scaling.set(
			radius,
			height * (1 / baseHeight),
			radius,
		)
	}

	setPosition(position: Vec3) {
		this.prop.position.set(
			...position
				.clone()
				.add_(0, this.height / 2, 0)
				.array()
		)
		return this
	}

	setRotation(rotation: Quat) {
		this.prop.rotationQuaternion = new Quaternion().set(...rotation.array())
		return this
	}
}

