
import {Vec2, Vec3} from "@benev/toolbox"
import {DungeonLayout} from "./layout.js"
import {Simtron} from "../station/simtron.js"
import {Box2} from "../physics/shapes/box2.js"

export function dungeonStartup(simtron: Simtron, layout: DungeonLayout) {
	const {simulator, station} = simtron

	simulator.create("dungeon", {options: layout.options})
	const dungeon = station.dungeon
	const randy = dungeon.makeRandy()

	const howManyBoxesToSpawn = 20
	let count = 0
	out: for (const {sector, cell, tiles} of layout.floors) {
		for (const spawn of randy.take(10, tiles.array())) {
			count += 1
			if (count > howManyBoxesToSpawn)
				break out

			const dimensions = new Vec3(
				randy.range(.5, 1.5),
				randy.range(.5, 1.5),
				randy.range(.5, 1.5),
			)

			const proposedSpawnpoint = layout.space
				.toGlobalTileSpace(sector, cell, spawn)
				.clone()
				.add_(0.5, 0.5)

			const box = new Box2(proposedSpawnpoint, new Vec2(dimensions.x, dimensions.z))
			const availableCenter = dungeon.findAvailableSpace(box)

			if (availableCenter) {
				box.center = availableCenter
				simulator.create("block", {
					coordinates: box.center.array(),
					dimensions: dimensions.array(),
				})
			}
		}
	}

	// // TODO
	// simtron.spawnCrusader(99999)

	return dungeon
}

