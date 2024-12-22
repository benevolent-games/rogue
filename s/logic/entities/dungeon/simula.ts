
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

	for (const tile of dungeonLayout.wallTiles.values())
		station.phys.addObstacle(
			new PhysObstacle(
				Box2.fromCorner(tile, tileExtent)
			)
		)

	const randy = new Randy(state.options.seed)

	// const spawn = dungeonLayout.spawnpoints.yoink(randy)
	// simulator.create("block", {
	// 	coordinates: spawn.clone().add_(0.5, 0.5).array(),
	// 	dimensions: [0.9, 0.9],
	// 	height: 0.9,
	// })

	let count = 0

	for (const cells of dungeonLayout.tree.values()) {
		for (const tiles of cells.values()) {
			for (const spawn of randy.take(5, tiles.array())) {
				count += 1
				console.log(spawn)
				simulator.create("block", {
					coordinates: spawn.clone().add_(0.5, 0.5).array(),
					dimensions: [0.9, 0.9],
					height: 0.9,
				})
			}
		}
	}

	console.log("LOL", count)

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {},
	}
})

