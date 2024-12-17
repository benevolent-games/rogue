
import {Vecset2} from "./vecset2.js"
import {cardinals, ordinals} from "../../../tools/directions.js"

export function inferWallTiles(floorTiles: Vecset2) {
	const walls = new Vecset2(
		floorTiles.list().flatMap(
			tile => [
				...cardinals.map(c => tile.clone().add(c)),
				...ordinals.map(c => tile.clone().add(c)),
			]
		)
	)
	return new Vecset2(
		walls.list().filter(wall => !floorTiles.has(wall))
	)
}

