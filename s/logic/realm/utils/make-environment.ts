
import {Degrees, make_envmap} from "@benev/toolbox"

import {Constants, Light, NodeMaterial, PointLight, PostProcess} from "@babylonjs/core"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"

import {constants} from "../../../constants.js"
import {World} from "../../../tools/babylon/world.js"
import {Crate} from "../../../tools/babylon/logistics/crate.js"

export type Env = ReturnType<typeof makeEnvironment>

export function makeEnvironment(world: World) {
	const {scene} = world

	const torch = new PointLight("torch", new Vector3(0, 0, 0), scene)
	torch.diffuse = new Color3(1, 0.4, 0.1)
	torch.specular = new Color3(1, 0.4, 0.1)
	// torch.radius = 3
	torch.intensity = 30
	torch.falloffType = Light.FALLOFF_GLTF

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

	const guys = (() => {
		const baseGuy = MeshBuilder.CreateCapsule("guy", {
			height: 1.8,
			radius: constants.game.crusaderRadius,
		})
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
			local: mk(materials.happy, 1),
			remote: mk(materials.spicy, 1),
		}
	})()

	const indicators = (() => {
		const square = MeshBuilder.CreatePlane("square", {size: 1})
		square.isVisible = false
		square.material = materials.gray
		scene.removeMesh(square)

		const mk = (material: PBRMaterial, alpha: number) => {
			const clone = square.clone()
			clone.material = material
			clone.visibility = alpha
			scene.removeMesh(clone)
			return new Crate(clone)
		}

		return {
			sector: mk(materials.sad, 0.1),
			cell: mk(materials.happy, 0.1),
		}
	})()

	// const envmap = make_envmap(scene, constants.urls.envmap)
	// scene.environmentIntensity = 0.001

	const camera: ArcRotateCamera = new ArcRotateCamera(
		"camera",
		Degrees.toRadians(-90) - constants.game.cameraRotation,
		Degrees.toRadians(20),
		20,
		Vector3.Zero(),
		scene,
	)

	NodeMaterial.ParseFromFileAsync("retro", constants.urls.shaders.retro, scene).then(retro => {
		retro.createPostProcess(camera, 1.0, Constants.TEXTURE_LINEAR_LINEAR)
	})

	return {
		torch,
		camera,
		materials,
		guys,
		indicators,
	}
}

