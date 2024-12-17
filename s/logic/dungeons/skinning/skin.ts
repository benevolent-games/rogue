
import {Degrees, Randy, Vec2} from "@benev/toolbox"
import {Map2, Trashbin} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../layout.js"
import {DungeonPlacer} from "../rendering/placer.js"
import {Culler} from "../rendering/culling/culler.js"
import {WallFader} from "../rendering/walls/wall-fader.js"
import {WallSubject} from "../rendering/walls/wall-subject.js"
import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {SubjectGrid} from "../rendering/culling/subject-grid.js"
import {Spatial} from "../../../tools/babylon/logistics/types.js"
import {CullingSubject} from "../rendering/culling/culling-subject.js"

export class DungeonSkin {
	randy: Randy
	trashbin = new Trashbin()
	placer: DungeonPlacer

	assets: DungeonAssets
	styleBySector = new Map2<Vec2, string>()

	cullableGrid = new SubjectGrid()
	fadingGrid = new SubjectGrid<WallSubject>()

	culler = new Culler(this.cullableGrid)
	wallFader = new WallFader(this.fadingGrid)

	constructor(
			public layout: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {

		this.randy = new Randy(layout.options.seed)
		this.assets = new DungeonAssets(container, this.randy)
		this.placer = new DungeonPlacer(mainScale)

		const styles = [...this.assets.styles.keys()]
		for (const sector of this.layout.sectors.keys())
			this.styleBySector.set(sector, this.randy.choose(styles))

		this.#createFlooring()
	}

	#makeSpawner(cargo: Cargo, spatial: Partial<Spatial>) {
		return () => {
			const instance = cargo.instance(spatial)
			this.trashbin.disposable(instance)
			return instance
		}
	}

	#createFlooring() {
		const floorTiles = this.layout.floorTiles.list()

		for (const tile of floorTiles) {
			const sector = this.layout.sectorByTiles.require(tile)
			const styleKey = this.styleBySector.require(sector)
			const style = this.assets.styles.require(styleKey)

			const radians = Degrees.toRadians(this.randy.choose([0, -90, -180, -270]))
			const cargo = style.floors.require("1x1")()
			const spatial = this.placer.placeProp({location: tile, radians})
			const spawn = this.#makeSpawner(cargo, spatial)

			const subject = new CullingSubject(tile, spawn)
			this.cullableGrid.add(subject)
		}
	}

	dispose() {
		this.trashbin.dispose()
	}
}

