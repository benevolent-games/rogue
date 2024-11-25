
import {Randy, Vec2} from "@benev/toolbox"

export type DungeonOptions = {
	randy: Randy
	densities: Densities
	sectorWalk: DrunkWalkOptions
}

export type SectorOptions = {
	vector: Vec2
	densities: Densities
	sectorWalk: DrunkWalkOptions
}

export type Densities = {
	cells: number
	sectors: number
}

export type DrunkWalkOptions = {
	stepCount: number
	horizonDirection: Vec2
}

