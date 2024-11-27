
import {Vec2, Vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {LevelArchetype} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {makeDungeon} from "../../dungeons/make-dungeon.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const levelReplica = Realm.replica<LevelArchetype>(
	({realm, facts}) => {
		const {indicators} = realm.env
		const {dungeonOptions} = facts
		const floorInstancer = realm.glbs.templateGlb.instancer("floor, size=1x1, type=ref")

		const instances = new Set<TransformNode>()
		const dungeon = makeDungeon(dungeonOptions)

		const mainScale = 10 / 100
		const cellScale = 95 / 100
		const sectorScale = 98 / 100

		function locate(sector: Vec2, cell = Vec2.zero(), tile = Vec2.zero()) {
			const sectorOffset = dungeon.sectorSize.clone().multiply(sector).multiplyBy(mainScale)
			const cellOffset = dungeon.cellSize.clone().multiply(cell).multiplyBy(mainScale)
			const tileOffset = tile.clone().multiplyBy(mainScale)
			return Vec2.zero().add(sectorOffset, cellOffset, tileOffset)
		}

		function place(location: Vec2, rawScale: Vec2, verticalOffset: number) {
			const scale = rawScale.clone().multiplyBy(mainScale)
			return {
				scale: Vec3.new(scale.x, 1, scale.y),
				position: Coordinates.import(location)
					.add(scale.divideBy(2))
					.position()
					.add_(0, verticalOffset, 0),
			}
		}

		for (const [sector, cellPaths] of dungeon.sectorCellPaths) {
			const location = locate(sector)
			const {position, scale} = place(location, dungeon.sectorSize, 0.01)
			const sectorIndicator = indicators.sector(position, scale)
			instances.add(sectorIndicator)

			for (const cell of cellPaths) {
				const location = locate(sector, cell)
				const {position, scale} = place(location, dungeon.cellSize, 0.02)
				const cellIndicator = indicators.cell(position, scale)
				instances.add(cellIndicator)

				const tiles = dungeon.cellTiles.get(cell) ?? []

				for (const tile of tiles) {
					const location = locate(sector, cell, tile)
					const {position, scale} = place(location, Vec2.new(1, 1), 0.1)
					const floor = floorInstancer()
					floor.scaling.set(...scale.array())
					floor.position.set(...position.array())
					instances.add(floor)
				}
			}
		}

		// const randy = Randy.seed(config.seed)
		// const grid = new Grid(Vec2.new(7, 7))
		// const pathfinder = new Pathfinder(randy, grid)
		// const instances = new Set<TransformNode>()
		// const floorInstancer = realm.glbs.templateGlb.instancer("floor, size=1x1, type=ref")
		//
		// function generatePath() {
		// 	const start = Vec2.new(3, 0)
		// 	const end = Vec2.new(3, 6)
		// 	const goals = [
		// 		start,
		// 		pathfinder.pickRandomPoint(),
		// 		pathfinder.pickRandomPoint(),
		// 		pathfinder.pickRandomPoint(),
		// 		end,
		// 	]
		// 	return pathfinder.aStarChain(goals)
		// }
		//
		// function generateLevelBlock(offset: Vec2) {
		// 	const path = generatePath()
		// 	if (!path) throw new Error("pathfinder failed")
		//
		// 	const walkable = new Vecset2()
		// 	const knobCount = 2
		//
		// 	for (const vec of path)
		// 		walkable.add(vec)
		//
		// 	const knobRoots = randy.extract(knobCount, walkable.list())
		//
		// 	for (const root of knobRoots) {
		// 		for (const n1 of grid.neighbors(root)) {
		// 			walkable.add(n1)
		//
		// 			for (const n2 of grid.neighbors(n1)) {
		// 				walkable.add(n2)
		//
		// 				for (const n3 of grid.neighbors(n2)) {
		// 					walkable.add(n3)
		// 				}
		// 			}
		// 		}
		// 	}
		//
		// 	for (const vec of walkable.list()) {
		// 		const coordinates = Coordinates.import(vec.clone().add(offset))
		// 		const floor = floorInstancer()
		// 		instances.add(floor)
		// 		floor.position.set(...coordinates.position().add_(0, 0.2, 0).array())
		// 	}
		// }
		//
		// for (const i of loop(5))
		// 	generateLevelBlock(Vec2.new(0, (i * grid.extent.y)))

		return {
			replicate({feed, feedback}) {},
			dispose() {
				for (const instance of instances)
					instance.dispose()
			},
		}
	}
)

