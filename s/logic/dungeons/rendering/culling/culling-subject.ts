
import {Prop, Vec2} from "@benev/toolbox"

export class CullingSubject {
	prop: Prop | undefined

	constructor(
		public location: Vec2,
		private spawner: () => Prop
	) {}

	spawn() {
		if (!this.prop)
			this.prop = this.spawner()
	}

	dispose() {
		if (this.prop) {
			this.prop.dispose()
			this.prop = undefined
		}
	}
}

