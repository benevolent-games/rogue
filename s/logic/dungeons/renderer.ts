
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Realm} from "../realm/realm.js"
import {DungeonLayout} from "./layout.js"
import {Clock} from "../../tools/clock.js"
import {DungeonSkin} from "./skinning/skin.js"
import {Box2} from "../physics/shapes/box2.js"
import {prepareDungeonContainer} from "./skinning/prepare-dungeon-container.js"

/** Controls the rendering and re-rendering of a dungeon */
export class DungeonRenderer {
	skin: DungeonSkin

	constructor(public realm: Realm, public layout: DungeonLayout) {
		this.skin = this.makeSkin(realm.glbs.dungeonContainer)
	}

	async loadGlb(url: string) {
		try {
			const container = await this.realm.world.loadContainer(url)
			prepareDungeonContainer(container)
			this.dispose()
			this.skin = this.makeSkin(container)
		}
		catch (error) {
			console.error(`problem with dungeon glb`, error)
		}
	}

	makeSkin(container: AssetContainer): DungeonSkin {
		const clock = new Clock()
		const {layout, realm} = this
		const mainScale = 1.0
		const skin = new DungeonSkin(
			layout,
			container,
			realm,
			mainScale,
		)
		clock.log("dungeon skinning")
		return skin
	}

	render(seconds: number, area: Box2) {
		this.skin.flooring.renderArea(area)
		this.skin.walling.renderArea(seconds, area)
	}

	dispose() {
		this.skin.dispose()

		// don't delete the original template glb,
		// (so when user exits game and reboots a new level,
		// the standard default skin is always available)
		if (this.skin.container !== this.realm.glbs.dungeonContainer)
			this.skin.container.dispose()
	}
}

