
import {Vec2Array} from "@benev/toolbox"

export type CrusaderState = {
	author: number
	coordinates: Vec2Array
	rotation: number
	attack: AttackState | null
	block: number
}

export type CrusaderInputData = {
	attack: boolean
	block: number
	sprint: boolean
	rotation: number
	movementIntent: Vec2Array
}

export type AttackState = {
	expiresAtTick: number
}

