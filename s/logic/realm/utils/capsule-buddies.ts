
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {constants} from "../../../constants.js"

export class CapsuleBuddies {
	baseBuddy: Mesh

	constructor(private scene: Scene) {
		this.baseBuddy = MeshBuilder.CreateCapsule("capsuleBuddy", {
			height: 1.8,
			radius: constants.game.crusader.radius,
		})
		this.baseBuddy.position.y += 1.8 / 2
		this.scene.removeMesh(this.baseBuddy)
	}

	create(material: PBRMaterial) {
		const buddy = this.baseBuddy.clone()
		buddy.material = material
		this.scene.addMesh(buddy)
		return buddy
	}
}

