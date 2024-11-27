
import {Vec2Array} from "@benev/toolbox"

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

