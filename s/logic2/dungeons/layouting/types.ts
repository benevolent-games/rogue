
import {Randy, Vec2, Vec2Array} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {Vecset2} from "./vecset2.js"

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

export type AlgoParams = {
	randy: Randy
	sector: Vec2
	cell: Vec2
	tileGrid: Grid
	start: Vec2
	end: Vec2
	nextCellDirection: Vec2 | null
	previousCellDirection: Vec2 | null
}

export type AlgoResults = {
	walkables: Vecset2
	goalposts: Vec2[]
	spawnpoints: Vec2[]
}

export type AlgoFn = (params: AlgoParams) => AlgoResults

export const cellAlgo = (fn: AlgoFn) => fn

