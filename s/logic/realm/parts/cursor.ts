
import {ev} from "@benev/slate"
import {Vec2, Vec3} from "@benev/toolbox"
import {Matrix, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Cameraman} from "../utils/cameraman.js"
import {Line3} from "../../physics/shapes/line3.js"

export class Cursor {
	normalized = new Vec2(0, 0)
	worldPosition = new Vec3(0, 0, 0)

	constructor(public cameraman: Cameraman) {}

	attach(canvas: HTMLCanvasElement) {
		return ev(canvas, {pointermove: this.#pointermove(canvas)})
	}

	tick() {
		const nearClip = new Vector3(this.normalized.x, this.normalized.y, -1)
		const farClip = new Vector3(this.normalized.x, this.normalized.y, 1)
		const viewProjMatrix = this.cameraman.camera.getTransformationMatrix()
		const invViewProjMatrix = Matrix.Invert(viewProjMatrix)

		const rayStart = Vec3.from(Vector3.TransformCoordinates(nearClip, invViewProjMatrix))
		const rayEnd = Vec3.from(Vector3.TransformCoordinates(farClip, invViewProjMatrix))
		const ray = new Line3(rayStart, rayEnd)
		const direction = ray.vector.normalize()

		if (direction.y === 0) {
			console.warn("Ray is parallel to the y-plane; no intersection.")
			return null
		}

		const y = 0
		const t = (y - rayStart.y) / direction.y
		const x = rayStart.x + t * direction.x
		const z = rayStart.z + t * direction.z
		this.worldPosition.set_(x, y, z)
	}

	#pointermove = (canvas: HTMLCanvasElement) => (event: PointerEvent) => {
		const rect = canvas.getBoundingClientRect()
		const {clientX, clientY} = event
		
		const pixelsX = (clientX - rect.left) / rect.width
		const pixelsY = (clientY - rect.top) / rect.height

		this.normalized.x = (2 * pixelsX) - 1
		this.normalized.y = 1 - (2 * pixelsY)
	}
}

