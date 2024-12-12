
import {Prop, Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

export class CullingSubject {
	#prop: Prop | undefined

	constructor(
		public location: Vec2,
		private spawner: () => TransformNode
	) {}

	spawn() {
		if (!this.#prop) {
			this.#prop = this.spawner()
		}
	}

	dispose() {
		if (this.#prop) {
			this.#prop.dispose()
			this.#prop = undefined
		}
	}
}

