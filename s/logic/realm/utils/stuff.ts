
import {Vec3} from "@benev/toolbox"
import {Coordinates} from "./coordinates.js"
import {CoolMaterials} from "./cool-materials.js"
import {InstancedMesh, Mesh, MeshBuilder, Scene} from "@babylonjs/core"

export class Stuff {
	#blockMesh: Mesh

	constructor(public scene: Scene, public materials: CoolMaterials) {
		this.#blockMesh = MeshBuilder.CreateBox("block", {size: 1}, scene)
		this.#blockMesh.material = materials.pearl
		this.#blockMesh.scaling.set(1, 1, 1)
		scene.removeMesh(this.#blockMesh)
	}

	makeBlockGraphic() {
		return new BlockGraphic(this.#blockMesh.createInstance("blockinstance"))
	}
}

export class BlockGraphic {
	dimensions: Vec3 = Vec3.zero()
	coordinates: Coordinates = Coordinates.zero()

	constructor(public instance: InstancedMesh) {}

	setCoordinates(coordinates: Coordinates) {
		const heightOffset = this.dimensions.y / 2
		this.coordinates = coordinates
		this.instance.position.set(
			...coordinates
				.position()
				.add_(0, heightOffset, 0)
				.array()
		)
	}

	setDimensions(dimensions: Vec3) {
		this.dimensions = dimensions
		this.instance.scaling.set(...dimensions.array())
	}

	dispose() {
		this.instance.dispose()
	}
}

