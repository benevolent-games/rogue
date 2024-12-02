
import {Randy, Vec2, Vec2Array} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {Fattener} from "./fattener.js"
import {CellFlavors} from "./flavors.js"
import {DistanceAlgo} from "../../../tools/distance.js"
import { Vecset2 } from "./vecset2.js"
import { Map2 } from "@benev/slate"

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
	tiles: Vec2[]
	goalposts: Vec2[]
}

export const cellAlgo = (fn: (params: AlgoParams) => AlgoResults) => fn

