
import {Vec2Array} from "@benev/toolbox"

export type CrusaderState = {
	author: number
	speed: number
	speedSprint: number
	coordinates: Vec2Array
}

export type CrusaderInputData = {
	sprint: boolean
	movementIntent: Vec2Array
	rotation: number
}

