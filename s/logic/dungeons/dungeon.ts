
import {Vec2} from "@benev/toolbox"
import {Phys} from "../physics/phys.js"
import {DungeonLayout} from "./layout.js"
import {Box2} from "../physics/shapes/box2.js"
import {DungeonOptions} from "./layouting/types.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"

const tileSize = new Vec2(1, 1)

export class Dungeon {
	phys = new Phys()
	floorGrid = new ZenGrid<void>(Vec2.new(16, 16))

	constructor(public options: DungeonOptions) {
		const layout = new DungeonLayout(options)

		for (const wall of layout.walls.tiles())
			this.phys.makeObstacle(Box2.fromCorner(wall, tileSize))

		for (const floor of layout.floors.tiles()) {
			this.floorGrid.create(Box2.fromCorner(floor, tileSize))
		}
	}

	findNearestOpenFloorTile(box: Box2, size = 10) {
		const selector = new Box2(box.center, Vec2.all(size))
		const floorTiles = this.floorGrid.queryBoxes(selector)
			.map(floor => ({floor, distance: floor.center.distanceSquared(box.center)}))
			.toSorted((a, b) => a.distance - b.distance)
			.map(a => a.floor)

		for (const floor of floorTiles) {
			const occupied = (
				this.phys.obstacleGrid.check(floor) &&
				this.phys.bodyGrid.check(floor)
			)
			if (!occupied)
				return floor
		}

		return null
	}
}

