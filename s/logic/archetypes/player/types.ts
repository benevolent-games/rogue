
import {Vec2Array} from "@benev/toolbox"
import {ReplicatorId} from "../../framework/types.js"

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
	owner: ReplicatorId
	speed: number
	speedSprint: number
}

export type PlayerInput = {
	sprint: boolean
	intent: Vec2Array
}

export type PlayerWorld = {
	input: PlayerInput
	obstacles: any[]
}

