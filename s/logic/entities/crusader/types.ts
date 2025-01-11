
import {Vec2Array} from "@benev/toolbox"

export type CrusaderState = {
	author: number
	speed: number
	speedSprint: number
	coordinates: Vec2Array
	rotation: number
}

export type CrusaderInputData = {
	sprint: boolean
	rotation: number
	movementIntent: Vec2Array
}

