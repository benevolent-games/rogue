
import {DungeonOptions} from "./types.js"
import {Seeds} from "../../../tools/seeds.js"

export function stdDungeonOptions(): DungeonOptions {
	return {
		seed: Seeds.daily(),
		gridExtents: {
			cells: [3, 3],
			tiles: [24, 24],
		},
		sectorWalk: {
			stepCount: 20,
			horizonDirection: [0, 1],
		},
	}
}

