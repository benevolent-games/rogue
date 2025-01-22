
import {Vec2Array} from "@benev/toolbox"

export type CrusaderState = {
	author: number
	coordinates: Vec2Array
	rotation: number
	attack: AttackState | null
	block: boolean
}

export type CrusaderInputData = {
	attack: boolean
	block: boolean
	sprint: boolean
	rotation: number
	movementIntent: Vec2Array
}

export type AttackState = {
	expiresAtTick: number
}

