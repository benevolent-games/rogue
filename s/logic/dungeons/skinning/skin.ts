
import {Randy} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../dungeon-layout.js"
import {WallSubject} from "../rendering/walls/wall-subject.js"
import {SubjectGrid} from "../rendering/culling/subject-grid.js"

export class DungeonSkin {
	randy: Randy
	trashbin = new Trashbin()

	assets: DungeonAssets
	cullableGrid = new SubjectGrid()
	fadingGrid = new SubjectGrid<WallSubject>()

	constructor(
			public dungeon: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {

		this.randy = new Randy(dungeon.options.seed)
		this.assets = new DungeonAssets(container, this.randy)

		this.#createFlooring()
	}

	#createFlooring() {
		for (const tile of this.dungeon.walkables.list()) {
			// const radians = Degrees.toRadians(this.randy.choose)
		}
	}
}

