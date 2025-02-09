
import {Prop, Vec3} from "@benev/toolbox"
import {MeshBuilder, Scene} from "@babylonjs/core"

import {Coordinates} from "./coordinates.js"
import {CoolMaterials} from "./cool-materials.js"
import {Crate} from "../../../tools/babylon/logistics/crate.js"
import {PropPool} from "../../../tools/babylon/optimizers/prop-pool.js"

export class Stuff {
	#pool: PropPool

	constructor(public scene: Scene, public materials: CoolMaterials) {
		const mesh = BlockGraphic.makeMesh(scene, materials)
		const crate = new Crate(scene, mesh)
		this.#pool = new PropPool(crate, true)
		this.#pool.preload(50)
	}

	makeBlockGraphic() {
		const prop = this.#pool.acquire()
		return new BlockGraphic(prop, () => this.#pool.release(prop))
	}
}

export class BlockGraphic {
	dimensions: Vec3 = Vec3.zero()
	coordinates: Coordinates = Coordinates.zero()
	constructor(public prop: Prop, public dispose: () => void) {}

	static makeMesh(scene: Scene, materials: CoolMaterials) {
		const mesh = MeshBuilder.CreateBox("block", {size: 1}, scene)
		mesh.material = materials.pearl
		mesh.scaling.set(1, 1, 1)
		scene.removeMesh(mesh)
		return mesh
	}

	setCoordinates(coordinates: Coordinates) {
		const heightOffset = this.dimensions.y / 2
		this.coordinates = coordinates
		this.prop.position.set(
			...coordinates
				.position()
				.add_(0, heightOffset, 0)
				.array()
		)
	}

	setDimensions(dimensions: Vec3) {
		this.dimensions = dimensions
		this.prop.scaling.set(...dimensions.array())
	}
}

