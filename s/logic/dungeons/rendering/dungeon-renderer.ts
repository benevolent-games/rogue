
import {Dungeon} from "../dungeon.js"
import {Realm} from "../../realm/realm.js"
import {DungeonSkin} from "./utils/dungeon-skin.js"
import {DungeonAssets} from "./utils/dungeon-assets.js"

/** Controls the rendering and re-rendering of a dungeon */
export class DungeonRenderer {
	skin: DungeonSkin

	constructor(public realm: Realm, public dungeon: Dungeon) {
		const assets = new DungeonAssets(realm.glbs.templateGlb.container)
		this.skin = this.makeSkin(assets)
	}

	async load(url: string) {
		const container = await this.realm.world.loadContainer(url)
		try {
			const assets = new DungeonAssets(container)
			this.dispose()
			this.skin = this.makeSkin(assets)
		}
		catch (error) {
			console.error(`problem with dungeon glb`, error)
		}
	}

	makeSkin(assets: DungeonAssets): DungeonSkin {
		const {dungeon, realm} = this
		const mainScale = 1.0
		const skin = new DungeonSkin(
			dungeon,
			assets,
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
		if (this.skin.assets.container !== this.realm.glbs.templateGlb.container)
			this.skin.assets.container.dispose()
	}
}

