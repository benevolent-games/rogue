
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {constants} from "../../constants.js"
import {World} from "../../tools/babylon/world.js"
import {prepareDungeonContainer} from "../dungeons/skinning/prepare-dungeon-container.js"

export class Glbs {
	constructor(
		public dungeonContainer: AssetContainer,
		public pimsleyContainer: AssetContainer,
	) {}

	static async load(world: World) {
		const [dungeonContainer, pimsleyContainer] = await Promise.all([
			world.loadContainer(constants.urls.dungeonGlb),
			world.loadContainer(constants.urls.pimsleyGlb),
		])
		prepareDungeonContainer(dungeonContainer)
		prepareDungeonContainer(pimsleyContainer)
		return new this(dungeonContainer, pimsleyContainer)
	}

	dispose() {
		this.dungeonContainer.dispose()
	}
}

