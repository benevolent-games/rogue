
import {TransformNode} from "@babylonjs/core"
import {babyloid, Meshoid, Prop} from "@benev/toolbox"

export function getChildProps(transform: TransformNode) {
	const props = new Map<string, Prop>()
	for (const prop of transform.getChildren(babyloid.is.prop, false))
		props.set(prop.name, prop)
	return props
}

export function getChildMeshoids(transform: TransformNode) {
	const meshoids = new Map<string, Meshoid>()
	for (const meshoid of transform.getChildren(babyloid.is.meshoid, false))
		meshoids.set(meshoid.name, meshoid)
	return meshoids
}

export function getMeshoids(transform: TransformNode) {
	const meshoids = getChildMeshoids(transform)
	if (babyloid.is.meshoid(transform))
		meshoids.set(transform.name, transform)
	return meshoids
}

export function getTopMeshes(transform: TransformNode): Meshoid[] {
	return (babyloid.is.meshoid(transform))
		? [transform]
		: transform.getChildren(babyloid.is.meshoid, true)
}

