
import {Randy, Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Box2} from "../../physics/shapes/box2.js"
import {simula} from "../../../archimedes/exports.js"
import {DungeonLayout} from "../../dungeons/layout.js"
import {Phys, PhysObstacle} from "../../physics/phys.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state, simulator}) => {

	station.phys = new Phys()
	const dungeonLayout = new DungeonLayout(state.options)
	const tileExtent = new Vec2(1, 1)
	const randy = new Randy(state.options.seed)

	for (const wall of dungeonLayout.walls.tiles())
		station.phys.addObstacle(
			new PhysObstacle(
				Box2.fromCorner(wall, tileExtent)
			)
		)

	let count = 0

	for (const {sector, cell, tiles} of dungeonLayout.floors) {
		for (const spawn of randy.take(5, tiles.array())) {
			const spawnpoint = dungeonLayout.space.toGlobalTileSpace(sector, cell, spawn)
			count += 1
			simulator.create("block", {
				coordinates: spawnpoint.clone().add_(0.5, 0.5).array(),
				dimensions: [0.9, 0.9],
				height: 0.9,
			})
		}
	}

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {},
	}
})

