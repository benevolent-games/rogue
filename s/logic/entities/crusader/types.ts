
import {Vec2Array} from "@benev/toolbox"

export type CrusaderState = {
	author: number
	coordinates: Vec2Array
	rotation: number
	attack: boolean
	block: boolean
}

export type CrusaderInputData = {
	attack: boolean
	block: boolean
	sprint: boolean
	rotation: number
	movementIntent: Vec2Array
}

