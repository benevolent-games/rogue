
import {loop2d, make_envmap, Radians, Vec2, Vec3} from "@benev/toolbox"

import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
// import {AxesViewer} from "@babylonjs/core/Debug/axesViewer.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"

import {Coordinates} from "./coordinates.js"
import {constants} from "../../../constants.js"
import {World} from "../../../tools/babylon/world.js"

export function makeEnvironment(world: World) {
	const {scene} = world

	// new AxesViewer(scene, 2)

	const materials = (() => {
		const mk = (r: number, g: number, b: number) => {
			const m = new PBRMaterial("custom", scene)
			m.albedoColor = new Color3(r, g, b)
			m.roughness = 0.9
			m.metallic = 0
			return m
		}
		return {
			gray: mk(.1, .1, .1),
			pearl: mk(.7, .7, .7),
			happy: mk(.1, .7, .7),
			angry: mk(.7, .1, .1),
			spicy: mk(.6, .5, .1),
			sad: mk(.2, .1, .7),
		}
	})()

	const box = MeshBuilder.CreateBox("box", {width: 0.9, height: 0.2, depth: 0.9})
	box.isVisible = false
	box.material = materials.gray

	const guys = (() => {
		const baseGuy = MeshBuilder.CreateCapsule("guy", {height: 1.8, radius: 0.4})
		baseGuy.position.y += 1.8 / 2
		scene.removeMesh(baseGuy)

		const mk = (material: PBRMaterial, alpha: number) => {
			const guy = baseGuy.clone()
			guy.material = material
			guy.visibility = alpha
			scene.removeMesh(guy)
			return guy
		}

		return {
			target: mk(materials.happy, 0.9),
			local: mk(materials.sad, 0.4),
			raw: mk(materials.angry, 0.4),
			authentic: mk(materials.spicy, 0.6),
		}
	})()

	const indicators = (() => {
		let count = 0

		const square = MeshBuilder.CreateBox("square", {width: 1, height: 0.1, depth: 1})
		square.isVisible = false
		square.material = materials.gray
		scene.removeMesh(square)

		const mk = (material: PBRMaterial, alpha: number) => {
			const clone = square.clone()
			clone.material = material
			clone.visibility = alpha
			scene.removeMesh(clone)
			return (position = Vec3.zero(), scale = Vec3.zero()) => {
				const instance = clone.createInstance(`square-${count++}`)
				instance.material = material
				instance.position.set(...position.array())
				instance.scaling.set(...scale.array())
				return instance
			}
		}

		return {
			sector: mk(materials.sad, 0.6),
			cell: mk(materials.happy, 0.6),
		}
	})()

	const envmap: {hdrTexture: CubeTexture, dispose: () => void} = make_envmap(scene, constants.urls.envmap)
	scene.environmentIntensity = 0.1

	const camera: ArcRotateCamera = new ArcRotateCamera(
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
		const position = Coordinates
			.array(raw)
			.subtract(halfExtent)
			.position()
			.add(offset)
		const instance = box.createInstance("box-instance")
		instance.position.set(...position.array())
	}

	return {
		camera,
		envmap,
		materials,
		guys,
		indicators,
	}
}

