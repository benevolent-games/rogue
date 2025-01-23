
import {Vec2} from "@benev/toolbox"
import {Grace} from "./utils/grace"

export type PimsleyAnimState = {
	tick: number
	seconds: number
	movement: Vec2
	grace: Grace
	spin: number
	attack: boolean
	block: number
}

export type AmbleState = {
	seconds: number
	movement: Vec2
	spin: number
	grace: Grace
}

