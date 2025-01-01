
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Dungeon} from "../../dungeons/dungeon.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state, simulator}) => {

	const dungeon = new Dungeon(state.options)
	const randy = dungeon.makeRandy()
	station.dungeon = dungeon

	let count = 0

	// out: for (const {sector, cell, tiles} of dungeon.layout.floors) {
	// 	for (const spawn of randy.take(2, tiles.array())) {
	// 		if (count > 10)
	// 			break out
	// 		count += 1
	//
	// 		const proposedSpawnpoint = dungeon.layout.space.toGlobalTileSpace(sector, cell, spawn)
	// 		const availableSpawnpoint = dungeon.findNearestOpenFloorTile(proposedSpawnpoint)
	// 		if (availableSpawnpoint) {
	// 			simulator.create("block", {
	// 				coordinates: availableSpawnpoint.center.array(),
	// 				dimensions: [0.9, 0.9, 0.9],
	// 			})
	// 		}
	// 	}
	// }

	console.log("spawned blocks", count)

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {},
	}
})

