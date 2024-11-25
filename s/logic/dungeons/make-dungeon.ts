
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

import {Grid} from "./utils/grid.js"
import {DungeonOptions} from "./types.js"
import {drunkWalkToHorizon} from "./utils/drunk-walk-to-horizon.js"
import { Vecset2 } from "./utils/vecset2.js"
import { Sector } from "./utils/sector.js"

export function makeDungeon(options: DungeonOptions) {
	const {randy, sectorWalk, densities} = options

	const sectorPath = drunkWalkToHorizon({randy, ...options.sectorWalk})
		.map(vector => new Sector({vector, sectorWalk, densities}))

	// populate sectors with cells
}

