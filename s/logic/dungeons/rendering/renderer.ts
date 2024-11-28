
import {Trashbin} from "@benev/slate"
import {Dungeon} from "../dungeon.js"
import {Realm} from "../../realm/realm.js"
import {Glb} from "../../../tools/babylon/glb.js"
import { TransformNode } from "@babylonjs/core"
import { Vec2, Vec3 } from "@benev/toolbox"
import { Coordinates } from "../../realm/utils/coordinates.js"

type DungeonSkin = {
	glb: Glb
	trashbin: Trashbin
}

export class DungeonRenderer {
	skin: DungeonSkin

	constructor(public realm: Realm, public dungeon: Dungeon) {
		const glb = realm.glbs.templateGlb
		this.skin = this.makeSkin(glb)
	}

	async load(url: string) {
		const container = await this.realm.world.loadContainer(url)
		const glb = new Glb(container)
		this.dispose()
		this.skin = this.makeSkin(glb)
	}

	makeSkin(glb: Glb): DungeonSkin {
		const {realm, dungeon} = this
		const {indicators} = realm.env

		const trashbin = new Trashbin()
		const instances = new Set<TransformNode>()
		const floorInstancer = glb.instancer("floor, size=1x1, type=ref")

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
		return {glb, trashbin}
	}

	dispose() {
		this.skin.trashbin.dispose()

		// don't delete the original template glb,
		// (so when user exits game and reboots a new level,
		// the standard default skin is always available)
		if (this.skin.glb !== this.realm.glbs.templateGlb)
			this.skin.glb.dispose()
	}
}

