
import {Vec2, Vec3} from "@benev/toolbox"
import {DungeonLayout} from "./layout.js"
import {constants} from "../../constants.js"
import {Simtron} from "../station/simtron.js"
import {Box2} from "../physics/shapes/box2.js"

export function dungeonStartup(simtron: Simtron, layout: DungeonLayout) {
	const {simulator, station} = simtron

	simulator.create("dungeon", {options: layout.options})
	const dungeon = station.dungeon
	const randy = dungeon.makeRandy()

	{
		const howManyBoxesToSpawn = 2000
		let count = 0
		out: for (const {sector, cell, tiles} of layout.floors) {
			for (const spawn of randy.take(10, tiles.array())) {
				count += 1
				if (count >= howManyBoxesToSpawn)
					break out

				const dimensions = new Vec3(
					randy.range(0.5, 1.5),
					randy.range(0.5, 1.5),
					randy.range(0.5, 1.5),
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
		console.log("spawned blocks", count)
	}

	{
		const howManyBots = 10
		const radius = constants.crusader.radius
		const diameter = radius * 2
		let count = 0
		out: for (const {sector, cell, tiles} of layout.floors) {
			for (const spawn of randy.take(10, tiles.array())) {
				count += 1
				if (count >= howManyBots)
					break out

				const proposedSpawnpoint = layout.space
					.toGlobalTileSpace(sector, cell, spawn)
					.clone()
					.add_(0.5, 0.5)

				const box = new Box2(proposedSpawnpoint, new Vec2(diameter, diameter))
				const availableCenter = dungeon.findAvailableSpace(box)

				if (availableCenter) {
					box.center = availableCenter
					simulator.create("bot", {
						biped: {
							block: 0,
							rotation: 0,
							attack: null,
							coordinates: box.center.array(),
						},
					})
				}
			}
		}
		console.log("spawned bots", count)
	}

	return dungeon
}

