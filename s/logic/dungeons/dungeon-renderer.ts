
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Realm} from "../realm/realm.js"
import {DungeonLayout} from "./dungeon-layout.js"
import {DungeonSkin} from "./rendering/skin.js"

/** Controls the rendering and re-rendering of a dungeon */
export class DungeonRenderer {
	skin: DungeonSkin

	constructor(public realm: Realm, public dungeon: DungeonLayout) {
		this.skin = this.makeSkin(realm.glbs.templateGlb.container)
	}

	async loadGlb(url: string) {
		try {
			const container = await this.realm.world.loadContainer(url)
			this.dispose()
			this.skin = this.makeSkin(container)
		}
		catch (error) {
			console.error(`problem with dungeon glb`, error)
		}
	}

	makeSkin(container: AssetContainer): DungeonSkin {
		const {dungeon, realm} = this
		const mainScale = 1.0
		const skin = new DungeonSkin(
			dungeon,
			container,
			realm,
			mainScale,
		)
		console.log("dungeon skinner stats", skin.stats)
		return skin
	}

	dispose() {
		this.skin.dispose()

		// don't delete the original template glb,
		// (so when user exits game and reboots a new level,
		// the standard default skin is always available)
		if (this.skin.container !== this.realm.glbs.templateGlb.container)
			this.skin.container.dispose()
	}
}

