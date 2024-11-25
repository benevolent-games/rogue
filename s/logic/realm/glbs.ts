
import {constants} from "../../constants.js"
import {Glb} from "../../tools/babylon/glb.js"
import {World} from "../../tools/babylon/world.js"

export class Glbs {
	constructor(
		public world: World,
		public templateGlb: Glb,
	) {}

	static async load(world: World) {
		const templateContainer = await world.loadContainer(constants.urls.templateGlb)
		const templateGlb = new Glb(templateContainer)
		return new this(world, templateGlb)
	}

	dispose() {
		this.templateGlb.container.removeAllFromScene()
		this.templateGlb.container.dispose()
	}
}

