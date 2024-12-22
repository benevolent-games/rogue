
import {Randy} from "@benev/toolbox"
import {DungeonOptions} from "./types.js"

export function stdDungeonOptions(): DungeonOptions {
	return {
		seed: 1215997383,
		// seed: Randy.randomSeed(),
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

