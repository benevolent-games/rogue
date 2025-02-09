
import {Degrees} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Light} from "@babylonjs/core/Lights/light.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {SpotLight} from "@babylonjs/core/Lights/spotLight.js"
import {PointLight} from "@babylonjs/core/Lights/pointLight.js"

export class Lighting {
	spot: SpotLight
	torch: PointLight

	constructor(public scene: Scene) {
		this.spot = this.#makeSpot()
		this.torch = this.#makeTorch()
	}

	#makeSpot() {
		const position = new Vector3(0, 10, 0)
		const direction = new Vector3(0, -10, 0)
		const coneAngle = Degrees.toRadians(120)
		const exponent = 1000
		const light = new SpotLight("spot", position, direction, coneAngle, exponent, this.scene)
		const color = new Color3(0.5, 0.6, 1)
		light.diffuse = color
		light.specular = color
		light.range = 50
		light.intensity = 40
		light.falloffType = Light.FALLOFF_GLTF
		return light
	}

	#makeTorch() {
		const position = Vector3.Zero()
		const light = new PointLight("torch", position, this.scene)
		const color = new Color3(1, 0.4, 0.1)
		light.diffuse = color
		light.specular = color
		light.intensity = 40
		light.range = 10
		light.falloffType = Light.FALLOFF_GLTF
		return light
	}
}

