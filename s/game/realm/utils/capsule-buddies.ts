
import {Degrees} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {constants} from "../../../constants.js"

export class CapsuleBuddies {
	baseBuddy: Mesh
	baseNose: Mesh

	#noseSize = 0.3

	constructor(private scene: Scene) {
		const height = 1.8
		this.baseBuddy = MeshBuilder.CreateCapsule("capsuleBuddy", {
			height,
			radius: constants.crusader.radius,
		}, scene)
		this.baseBuddy.position.y += height / 2
		this.scene.removeMesh(this.baseBuddy)

		const noseSize = this.#noseSize
		this.baseNose = MeshBuilder.CreateBox("baseNose", {
			height: noseSize,
			width: noseSize,
			depth: noseSize,
		}, scene)
		this.baseNose.position.y = height * (3 / 4)
		this.scene.removeMesh(this.baseNose)
	}

	create(material: PBRMaterial) {
		const buddy = this.baseBuddy.clone("buddyinstance")
		buddy.material = material
		this.scene.addMesh(buddy)

		const nose = this.baseNose.clone("noseinstance")
		nose.material = material
		nose.position.z += constants.crusader.radius - (this.#noseSize / 4)
		nose.setParent(buddy)
		nose.rotationQuaternion = Quaternion.RotationYawPitchRoll(Degrees.toRadians(45), 0, 0)

		return buddy
	}
}

