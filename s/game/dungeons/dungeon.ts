
import {Randy, Vec2} from "@benev/toolbox"

import {Phys} from "../physics/phys.js"
import {DungeonLayout} from "./layout.js"
import {constants} from "../../constants.js"
import {Box2} from "../physics/shapes/box2.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"

export class Dungeon {
	phys = new Phys()
	tileSize = new Vec2(1, 1)
	floorGrid = new ZenGrid<void>(constants.sim.hashgridExtent)

	constructor(public layout: DungeonLayout) {
		for (const wall of this.layout.walls.tiles())
			this.phys.makeBody({
				parts: [{
					mass: Infinity,
					shape: Box2.fromCorner(wall, this.tileSize),
				}],
				updated: () => {},
			})

		for (const floor of this.layout.floors.tiles())
			this.floorGrid.create(Box2.fromCorner(floor, this.tileSize))
	}

	get options() {
		return this.layout.options
	}

	makeRandy() {
		return new Randy(this.options.seed)
	}

	findAvailableSpace(item: Box2, requiredProximity = 10) {
		const localArea = new Box2(item.center, Vec2.all(requiredProximity))
		const nearbyFloorTiles = this.floorGrid.queryBoxes(localArea)
			.map(floor => ({floor, distance: floor.center.distanceSquared(item.center)}))
			.toSorted((a, b) => a.distance - b.distance)
			.map(a => a.floor)

		for (const floor of nearbyFloorTiles) {
			const proposedItem = new Box2(floor.center, item.extent)
			const proposedSpaceIsAvailable = this.phys.queryBodies(proposedItem).length === 0
			if (proposedSpaceIsAvailable)
				return proposedItem.center.clone()
		}

		return null
	}

	getSpawnpoint() {
		const center = this.layout.goalposts.at(0)!
			.clone()
			.add_(0.5, 0.5)
		const proposal = new Box2(center, new Vec2(0.99, 0.99))
		return this.findAvailableSpace(proposal)
	}
}

