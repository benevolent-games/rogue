
import {Randy, Vec2} from "@benev/toolbox"
import {Phys} from "../physics/phys.js"
import {DungeonLayout} from "./layout.js"
import {Box2} from "../physics/shapes/box2.js"
import {Stopwatch} from "../../tools/clock.js"
import {DungeonOptions} from "./layouting/types.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"

export class Dungeon {
	phys = new Phys()
	tileSize = new Vec2(1, 1)
	floorGrid = new ZenGrid<void>(Vec2.new(16, 16))

	layout: DungeonLayout

	constructor(public options: DungeonOptions) {
		const timing = new Stopwatch()
		this.layout = new DungeonLayout(options)

		timing.log("layout")

		for (const wall of this.layout.walls.tiles())
			this.phys.makeBody({
				parts: [{
					shape: Box2.fromCorner(wall, this.tileSize),
					mass: null,
				}],
				updated: () => {},
			})

		timing.log("wall phys")

		for (const floor of this.layout.floors.tiles())
			this.floorGrid.create(Box2.fromCorner(floor, this.tileSize))

		timing.log("floor grid")
	}

	makeRandy() {
		return new Randy(this.options.seed)
	}

	findNearestOpenFloorTile(point: Vec2, proximity = 10) {
		const selector = new Box2(point, Vec2.all(proximity))
		const floorTiles = this.floorGrid.queryBoxes(selector)
			.map(floor => ({floor, distance: floor.center.distanceSquared(point)}))
			.toSorted((a, b) => a.distance - b.distance)
			.map(a => a.floor)

		for (const floor of floorTiles) {
			const isVacant = this.phys.queryBodies(floor).length === 0
			if (isVacant)
				return floor
		}

		return null
	}
}

