
import {DungeonOptions} from "./types.js"

export function stdDungeonOptions(): DungeonOptions {
	return {
		seed: Math.random(),
		gridExtents: {
			cells: [3, 3],
			tiles: [24, 24],
		},
		sectorWalk: {
			stepCount: 1,
			horizonDirection: [0, 1],
		},
	}
}

