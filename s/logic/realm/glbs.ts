
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {constants} from "../../constants.js"
import {World} from "../../tools/babylon/world.js"

export class Glbs {
	constructor(
		public dungeonContainer: AssetContainer,
	) {}

	static async load(world: World) {
		const dungeonContainer = await world.loadContainer(constants.urls.dungeonGlb)
		return new this(dungeonContainer)
	}

	dispose() {
		this.dungeonContainer.dispose()
	}
}

