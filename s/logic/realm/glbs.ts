
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {constants} from "../../constants.js"
import {World} from "../../tools/babylon/world.js"
import {prepareDungeonContainer} from "../dungeons/skinning/prepare-dungeon-container.js"

export class Glbs {
	constructor(
		public dungeonContainer: AssetContainer,
	) {}

	static async load(world: World) {
		const dungeonContainer = await world.loadContainer(constants.urls.dungeonGlb)
		prepareDungeonContainer(dungeonContainer)
		return new this(dungeonContainer)
	}

	dispose() {
		this.dungeonContainer.dispose()
	}
}

