
import {Vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {LevelArchetype} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {makeDungeon} from "../../dungeons/make-dungeon.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const levelReplica = Realm.replica<LevelArchetype>(
	({realm, facts}) => {
		const {indicators} = realm.env
		const {dungeonOptions} = facts
		const instances = new Set<TransformNode>()
		const dungeon = makeDungeon(dungeonOptions)

		const mainScale = 25 / 100
		const cellScale = 95 / 100
		const sectorScale = 98 / 100

		const cellSize = dungeon.cellSize.clone().multiplyBy(mainScale)
		const sectorSize = dungeon.sectorSize.clone().multiplyBy(mainScale)
		const halfCellSize = cellSize.clone().multiplyBy(0.5)
		const halfSectorSize = sectorSize.clone().multiplyBy(0.5)

		for (const [sector, cellPaths] of dungeon.sectorCellPaths) {
			const sectorCoords = Coordinates.import(sectorSize).multiply(sector)
			const sectorPosition = sectorCoords.position().add_(0, 0.1, 0)
			const {x: scaleX, y: scaleY} = sectorSize.clone().multiplyBy(sectorScale)
			const sectorIndicator = indicators.sector(
				sectorPosition,
				Vec3.new(scaleX, 1, scaleY),
			)
			instances.add(sectorIndicator)

			for (const cell of cellPaths) {
				const relativeCellCoords = Coordinates.import(cellSize).multiply(cell)
				const absoluteCellCoords = sectorCoords.clone().subtract(halfSectorSize).add(halfCellSize).add(relativeCellCoords)
				const cellPosition = absoluteCellCoords.position().add_(0, 0.2, 0)
				const {x: scaleX, y: scaleY} = cellSize.clone().multiplyBy(cellScale)
				const cellIndicator = indicators.cell(
					cellPosition,
					Vec3.new(scaleX, 1, scaleY),
				)
				instances.add(cellIndicator)
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

