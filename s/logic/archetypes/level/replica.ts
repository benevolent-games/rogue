
import {Vec2, Vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {LevelArchetype} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {Dungeon} from "../../dungeons/make-dungeon.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const levelReplica = Realm.replica<LevelArchetype>(
	({realm, facts}) => {
		const {indicators} = realm.env
		const {dungeonOptions} = facts
		const floorInstancer = realm.glbs.templateGlb.instancer("floor, size=1x1, type=ref")

		const instances = new Set<TransformNode>()
		const dungeon = new Dungeon(dungeonOptions)

		const mainScale = 20 / 100
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

		console.log("floor tile count", tileCount)

		return {
			replicate({feed, feedback}) {},
			dispose() {
				for (const instance of instances)
					instance.dispose()
			},
		}
	}
)

