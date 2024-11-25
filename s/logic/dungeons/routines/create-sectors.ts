
import {Randy} from "@benev/toolbox"
import {Sector} from "../utils/sector.js"
import {Densities, DrunkWalkOptions} from "../types.js"
import {drunkWalkToHorizon} from "../utils/drunk-walk-to-horizon.js"

export function createSectors(options: {
		randy: Randy
		densities: Densities
		sectorWalk: DrunkWalkOptions
	}) {

	const {randy, densities, sectorWalk} = options

	return drunkWalkToHorizon({randy, ...options.sectorWalk})
		.map(vector => new Sector({vector, sectorWalk, densities}))
}

