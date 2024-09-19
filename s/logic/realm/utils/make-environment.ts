
import {loop2d, make_envmap, Radians, Vec2, Vec2Array, Vec3} from "@benev/toolbox"
import {ArcRotateCamera, AxesViewer, Color3, MeshBuilder, PBRMaterial, Vector3} from "@babylonjs/core"

import {Coordinates} from "./coordinates.js"
import {constants} from "../../../constants.js"
import {World} from "../../../tools/babylon/world.js"

export function makeEnvironment(world: World) {
	const {scene} = world

	new AxesViewer(scene, 2)

	const plain = new PBRMaterial("plain", scene)
	plain.albedoColor = new Color3(0.8, 0.8, 0.8)
	plain.roughness = 0.9
	plain.metallic = 0

	const friendly = new PBRMaterial("friendly", scene)
	friendly.albedoColor = new Color3(0, 0.8, 0)
	friendly.roughness = 0.9
	friendly.metallic = 0

	const box = MeshBuilder.CreateBox("box", {width: 0.9, height: 0.2, depth: 0.9}, scene)
	box.material = plain

	const guy = MeshBuilder.CreateCapsule("guy", {height: 1.8, radius: 0.4}, scene)
	guy.material = friendly
	guy.position.y += 1.8 / 2

	const envmap = make_envmap(scene, constants.urls.envmap)
	scene.environmentIntensity = 0.1

	const camera = new ArcRotateCamera(
		"camera",
		Radians.from.degrees(-90),
		Radians.from.degrees(20),
		20,
		Vector3.Zero(),
		scene,
	)

	const extent = Vec2.new(100, 100)
	const halfExtent = extent.clone().divideBy(2)
	const offset = Vec3.new(0, -0.1, 0)

	for (const raw of loop2d(extent.array())) {
		const coords = Vec2.array(raw).subtractV(halfExtent)
		const position = Coordinates.planarToWorld(coords).addV(offset)
		const instance = box.createInstance("box-instance")
		instance.position.set(...position.array())
	}

	box.isVisible = false

	return {camera, envmap, guy}
}

