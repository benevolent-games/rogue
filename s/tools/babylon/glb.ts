
import {Map2} from "@benev/slate"
import {babyloid, Meshoid, Prop} from "@benev/toolbox"

import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {getTopMeshes} from "./babylon-helpers.js"

export type Instancer = () => TransformNode

export class Glb {
	readonly props = new Map2<string, Prop>()
	readonly meshoids = new Map2<string, Meshoid>()
	readonly materials = new Map2<string, PBRMaterial>()

	static instantiate(prop: Prop) {
		return prop.instantiateHierarchy(
			undefined,
			undefined,
			(source, clone) => {
				clone.name = source.name
			},
		) as TransformNode
	}

	static cloneProp(prop: Prop): Prop {
		return prop.clone(prop.name, null)!
	}

	static changeOpacity(prop: Prop, opacity: number) {
		getTopMeshes(prop).forEach(mesh => {
			mesh.visibility = opacity
			prop.getScene().removeMesh(mesh, true)
		})
	}

	constructor(public readonly container: AssetContainer) {
		for (const material of container.materials)
			if (material instanceof PBRMaterial)
				this.materials.set(material.name, material)

		for (const mesh of container.meshes.filter(babyloid.is.meshoid))
			this.meshoids.set(mesh.name, mesh)

		for (const node of [...container.meshes, ...container.transformNodes])
			if (!node.name.includes("_primitive"))
				this.props.set(node.name, node)
	}

	getSourceMesh(name: string): Mesh | undefined {
		const meshoid = this.meshoids.get(name)
		if (meshoid) {
			return meshoid instanceof InstancedMesh
				? meshoid.sourceMesh
				: meshoid
		}
	}

	instancer(name: string): Instancer {
		const prop = this.props.require(name)
		return () => Glb.instantiate(prop)
	}

	dispose() {
		this.container.removeAllFromScene()
		this.container.dispose()
	}
}

