
import {Vec2} from "@benev/toolbox"
import {Phys} from "../physics/phys.js"
import {Box2} from "../physics/shapes/box2.js"
import {DungeonLayout} from "../dungeons/layout.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"

export class Station {
	#dungeonLayout: DungeonLayout | null = null

	phys = new Phys()
	wallGrid = new ZenGrid(Vec2.new(16, 16))
	floorGrid = new ZenGrid(Vec2.new(16, 16))

	set dungeonLayout(dungeon: DungeonLayout) {
		this.#dungeonLayout = dungeon
	}

	get dungeonLayout() {
		if (!this.#dungeonLayout)
			throw new Error("dungeon layout is not set")
		return this.#dungeonLayout
	}

	findAvailableSpace(box: Box2) {
		return box.center
	}
}

