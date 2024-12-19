
import {Vec2} from "@benev/toolbox"
import {DungeonStyle} from "../style.js"

export type FloorSegment = {
	tile: Vec2
	size: Vec2
	location: Vec2
	rotation: number
	style: DungeonStyle
}

