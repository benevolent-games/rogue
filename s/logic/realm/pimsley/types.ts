
import {Vec2} from "@benev/toolbox"

export type PimsleyAnimState = {
	tick: number
	seconds: number
	movement: Vec2
	spin: number
	attack: boolean
	block: boolean
}

export type AmbleState = {
	seconds: number
	movement: Vec2
	spin: number
}

