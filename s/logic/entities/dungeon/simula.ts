
import {Vec2, Vec3} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Box2} from "../../physics/shapes/box2.js"
import {Dungeon} from "../../dungeons/dungeon.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state, simulator}) => {

	const layout = station.dungeonStore.make(state.options)
	const dungeon = new Dungeon(layout)
	const randy = dungeon.makeRandy()
	station.dungeon = dungeon

	// const howManyBoxesToSpawn = 2
	// let count = 0
	// out: for (const {sector, cell, tiles} of dungeon.layout.floors) {
	// 	for (const spawn of randy.take(2, tiles.array())) {
	// 		count += 1
	// 		if (count > howManyBoxesToSpawn)
	// 			break out
	//
	// 		const dimensions = new Vec3(
	// 			randy.range(0.2, 1.5),
	// 			randy.range(0.2, 1.5),
	// 			randy.range(0.2, 1.5),
	// 		)
	// 		const proposedSpawnpoint = dungeon.layout.space.toGlobalTileSpace(sector, cell, spawn).clone().add_(0.5, 0.5)
	// 		const box = new Box2(proposedSpawnpoint, new Vec2(dimensions.x, dimensions.z))
	// 		const availableCenter = dungeon.findAvailableSpace(box)
	//
	// 		console.log("SPAWN BLOCK")
	// 		console.log(" - proposed", proposedSpawnpoint.toString())
	//
	// 		if (availableCenter) {
	// 			box.center = availableCenter
	// 			console.log(" - available", box.center.toString())
	// 			simulator.create("block", {
	// 				coordinates: box.center.array(),
	// 				dimensions: dimensions.array(),
	// 			})
	// 		}
	// 	}
	// }
	//
	// console.log("spawned blocks", count)

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {},
	}
})

