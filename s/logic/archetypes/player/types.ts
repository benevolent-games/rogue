
import {Vec2, Vec2Array} from "@benev/toolbox"

export type PlayerArchetype = {
	facts: {
		config: PlayerConfig
		coordinates: Vec2Array
	}
	data: {
		input: PlayerInput
	}
	memo: {}
	broadcast: {}
}

export type PlayerConfig = {
	speed: number
	speedSprint: number
}

export type PlayerInput = {
	sprint: boolean
	intent: Vec2
}

export type PlayerWorld = {
	input: PlayerInput
	obstacles: any[]
}

