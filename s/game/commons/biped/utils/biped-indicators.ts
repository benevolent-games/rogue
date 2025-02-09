
import {Scene} from "@babylonjs/core/scene.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {Crate} from "../../../../tools/babylon/logistics/crate.js"
import {CoolMaterials} from "../../../realm/utils/cool-materials.js"
import {PropPool} from "../../../../tools/babylon/optimizers/prop-pool.js"

export class BipedIndicatorStore {
	attackDiscPool: PropPool

	constructor(
			public scene: Scene,
			public materials: CoolMaterials,
		) {

		this.attackDiscPool = (() => {
			const mesh = MeshBuilder.CreateDisc("attackcircle", {radius: 1})
			mesh.material = materials.create(1, 0.2, 0.2, 0.3)
			scene.removeMesh(mesh)
			const crate = new Crate(scene, mesh)
			return new PropPool(crate, true)
		})()

		this.attackDiscPool.preload(40)
	}

	dispose() {
		this.attackDiscPool.dispose()
	}
}

