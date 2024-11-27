
import {Map2} from "@benev/slate"
import {Vec2, Vec2Array} from "@benev/toolbox"

export type Dungeon = {
	cellSize: Vec2
	sectorSize: Vec2
	sectorCellPaths: Map2<Vec2, Vec2[]>
}

///////////////////

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

