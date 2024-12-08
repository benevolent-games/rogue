
import {Vec2Array} from "@benev/toolbox"

export type CrusaderState = {
	author: number
	speed: number
	speedSprint: number
}

export type CrusaderInputData = {
	sprint: boolean
	movementIntent: Vec2Array
}

