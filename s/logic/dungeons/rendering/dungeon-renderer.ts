
import {Quat, Radians, Vec2, Vec3} from "@benev/toolbox"

import {Dungeon} from "../dungeon.js"
import {Realm} from "../../realm/realm.js"
import {DungeonAssets} from "./utils/dungeon-assets.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import { Trashbin } from "@benev/slate"
import { Quaternion } from "@babylonjs/core/Maths/math.vector.js"

type DungeonSkin = {
	assets: DungeonAssets
	trashbin: Trashbin
}

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
		const [style] = [...assets.styles.values()]
		const spawners = style.makeSpawners()
		const trashbin = new Trashbin()

		const mainScale = 100 / 100
		const counts = {sectors: 0, cells: 0, tiles: 0}

		// TODO fix broken quat rotation methods in toolbox
		const rotation = Quat.import(Quaternion.RotationYawPitchRoll(0, Radians.from.degrees(90), 0))

		function place(location: Vec2, rawScale: Vec2, verticalOffset: number) {
			const scale = rawScale.clone().multiplyBy(mainScale)
			return {
				scale: Vec3.new(scale.x, scale.y, scale.y),
				position: Coordinates.import(location)
					.multiplyBy(mainScale)
					.add(scale.divideBy(2))
					.position()
					.add_(0, verticalOffset, 0),
			}
		}

		for (const sector of dungeon.sectors) {
			counts.sectors++
			const location = dungeon.tilespace(sector)
			const {position, scale} = place(location, dungeon.sectorSize, -0.02)
			const instance = realm.env.indicators.sector.instance({
				position,
				rotation,
				scale: scale.multiplyBy(0.999),
			})
			trashbin.disposable(instance)
		}

		for (const {sector, cell, tiles} of dungeon.cells) {
			counts.cells++
			const location = dungeon.tilespace(sector, cell)
			const {position, scale} = place(location, dungeon.cellSize, -0.01)
			const instance = realm.env.indicators.cell.instance({
				position,
				rotation,
				scale: scale.multiplyBy(0.99),
			})
			trashbin.disposable(instance)

			for (const tile of tiles) {
				counts.tiles++
				const location = dungeon.tilespace(sector, cell, tile)
				const {position, scale} = place(location, Vec2.new(1, 1), 0)
				spawners.floor.size1x1({position, scale})
			}
		}

		console.log("sectors", counts.sectors)
		console.log("cells", counts.cells)
		console.log("tiles", counts.tiles)

		return {assets, trashbin}
	}

	dispose() {
		this.skin.assets.dispose()
		this.skin.trashbin.dispose()

		// don't delete the original template glb,
		// (so when user exits game and reboots a new level,
		// the standard default skin is always available)
		if (this.skin.assets.container !== this.realm.glbs.templateGlb.container)
			this.skin.assets.container.dispose()
	}
}

