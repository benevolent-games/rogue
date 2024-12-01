
import {Vec2} from "@benev/toolbox"

export type WallPlacement = {
	location: Vec2
	cardinalIndex: number
}

export type CornerPlacement = {
	location: Vec2
	ordinalIndex: number
}

export type Cornering = {
	concaves: CornerPlacement[]
	convexes: CornerPlacement[]
}

