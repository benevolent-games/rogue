
import {Vec2} from "@benev/toolbox"
import {RogueEntities} from "../entities.js"
import {Station} from "../../station/station.js"
import {Box2} from "../../physics/shapes/box2.js"
import {simula} from "../../../archimedes/exports.js"
import {DungeonLayout} from "../../dungeons/layout.js"
import {Phys, PhysObstacle} from "../../physics/phys.js"

export const dungeonSimula = simula<RogueEntities, Station>()<"dungeon">(
	({station, state}) => {

	station.phys = new Phys()
	const dungeonLayout = new DungeonLayout(state.options)

	const tileExtent = new Vec2(1, 1)

	for (const tile of dungeonLayout.wallTiles.values())
		station.phys.addObstacle(new PhysObstacle(new Box2(tile, tileExtent)))

	return {
		inputData: undefined,
		simulate: (_) => {},
		dispose: () => {},
	}
})

