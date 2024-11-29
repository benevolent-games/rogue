
import {Trashbin} from "@benev/slate"
import {Vec2, Vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {Dungeon} from "../dungeon.js"
import {Realm} from "../../realm/realm.js"
import {Glb} from "../../../tools/babylon/glb.js"
import {DungeonAssets} from "./utils/dungeon-assets.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

type DungeonSkin = {
	assets: DungeonAssets
	trashbin: Trashbin
}

export class DungeonRenderer {
	skin: DungeonSkin

	constructor(public realm: Realm, public dungeon: Dungeon) {
		const glb = realm.glbs.templateGlb
		const assets = new DungeonAssets(glb)
		this.skin = this.makeSkin(assets)
	}

	async load(url: string) {
		const container = await this.realm.world.loadContainer(url)
		const glb = new Glb(container)
		try {
			const assets = new DungeonAssets(glb)
			this.dispose()
			this.skin = this.makeSkin(assets)
		}
		catch (error) {
			console.error(`problem with dungeon glb`, error)
		}
	}

	makeSkin(assets: DungeonAssets): DungeonSkin {
		const {realm, dungeon} = this
		const {indicators} = realm.env

		const trashbin = new Trashbin()
		const instances = new Set<TransformNode>()
		const [styleKey] = [...assets.styles.keys()]
		const style = assets.styles.require(styleKey)
		const floorInstancer = () => style.spawn.floor()

		const mainScale = 100 / 100
		let tileCount = 0

		function place(location: Vec2, rawScale: Vec2, verticalOffset: number) {
			const scale = rawScale.clone().multiplyBy(mainScale)
			return {
				scale: Vec3.new(scale.x, 1, scale.y),
				position: Coordinates.import(location)
					.multiplyBy(mainScale)
					.add(scale.divideBy(2))
					.position()
					.add_(0, verticalOffset, 0),
			}
		}

		for (const sector of dungeon.sectors) {
			const location = dungeon.tilespace(sector)
			const {position, scale} = place(location, dungeon.sectorSize, 0.01)
			const sectorIndicator = indicators.sector(position, scale)
			instances.add(sectorIndicator)
		}

		for (const {sector, cell, tiles} of dungeon.cells) {
			const location = dungeon.tilespace(sector, cell)
			const {position, scale} = place(location, dungeon.cellSize, 0.02)
			const cellIndicator = indicators.cell(position, scale)
			instances.add(cellIndicator)

			for (const tile of tiles) {
				tileCount++
				const location = dungeon.tilespace(sector, cell, tile)
				const {position, scale} = place(location, Vec2.new(1, 1), 0.1)
				const floor = floorInstancer()
				floor.scaling.set(...scale.array())
				floor.position.set(...position.array())
				instances.add(floor)
			}
		}

		trashbin.disposer(() => instances.forEach(i => i.dispose()))
		return {assets, trashbin}
	}

	dispose() {
		this.skin.trashbin.dispose()

		// don't delete the original template glb,
		// (so when user exits game and reboots a new level,
		// the standard default skin is always available)
		if (this.skin.assets.glb !== this.realm.glbs.templateGlb)
			this.skin.assets.glb.dispose()
	}
}

