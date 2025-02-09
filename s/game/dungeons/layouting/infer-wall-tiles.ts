
import {Vec2} from "@benev/toolbox"
import {Vecset2} from "./vecset2.js"
import {cardinals, ordinals} from "../../../tools/directions.js"

export function inferWallTiles(floorTiles: Vec2[]) {
	const floorSet = new Vecset2(floorTiles)

	const walls = new Vecset2(
		floorSet.array().flatMap(
			tile => [
				...cardinals.map(c => tile.clone().add(c)),
				...ordinals.map(c => tile.clone().add(c)),
			]
		)
	)

	return new Vecset2(
		walls.array().filter(wall => !floorSet.has(wall))
	)
}

