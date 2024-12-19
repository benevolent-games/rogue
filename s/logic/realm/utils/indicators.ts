
import {Scene} from "@babylonjs/core/scene.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {CoolMaterials} from "./cool-materials.js"
import {Crate} from "../../../tools/babylon/logistics/crate.js"

export class Indicators {
	cell: Crate
	sector: Crate

	constructor(scene: Scene, materials: CoolMaterials) {
		const square = MeshBuilder.CreatePlane("square", {size: 1})
		square.isVisible = false
		scene.removeMesh(square)

		const mk = (material: PBRMaterial, alpha: number) => {
			const clone = square.clone()
			clone.material = material
			clone.visibility = alpha
			scene.removeMesh(clone)
			return new Crate(clone)
		}

		this.sector = mk(materials.deepPurple, 0.1)
		this.cell = mk(materials.cyan, 0.1)
	}
}

