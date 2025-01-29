
import {Vec2, Vec2Array} from "@benev/toolbox"

export type BipedOptions = {
	radius: number
	alwaysAwake: boolean
	movement: {
		walkSpeed: number
		sprintSpeed: number
		omnidirectionalSprint: boolean
		attackingSpeedMultiplier: number
	}
	combat: {
		turnCap: number
		turnCapEnabled: boolean
	}
}

export type BipedState = {
	coordinates: Vec2Array
	rotation: number
	attack: BipedAttackState | null
	block: number
}

export type BipedActivity = {
	attack: boolean
	block: number
	sprint: boolean
	rotation: number
	movementIntent: Vec2
}

export type BipedAttackState = {
	expiresAtTick: number
	rotation: number
}

