
import {Randy, Vec2, Vec2Array} from "@benev/toolbox"

import {Grid} from "./utils/grid.js"
import {CellFlavors} from "./flavors.js"
import {Fattener} from "./utils/fattener.js"
import {DistanceAlgo} from "../../tools/distance.js"

export type DungeonOptions = {
	seed: number
	gridExtents: Extents
	sectorWalk: DrunkWalkOptions
}

///////////////////

export type Extents = {
	cells: Vec2Array
	tiles: Vec2Array
}

export type DrunkWalkOptions = {
	stepCount: number
	horizonDirection: Vec2Array
}

///////////////////

export type CellFlavor = (options: {randy: Randy}) => {
	distanceAlgo: DistanceAlgo
	goalposts: number
	fn: (params: {
		tilePath: Vec2[]
		fattener: Fattener
		sector: Vec2
		cell: Vec2
		start: Vec2
		end: Vec2
		forwardDirection: Vec2 | null
		backwardDirection: Vec2 | null
		tileGrid: Grid,
	}) => Vec2[]
}

export function flavors<F extends Record<string, CellFlavor>>(f: F) {
	return f
}

export type FlavorName = keyof typeof CellFlavors

