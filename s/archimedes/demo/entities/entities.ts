
import {Vec2Array} from "@benev/toolbox"
import {AsEntities} from "../../framework/parts/types.js"

export type GameEntities = AsEntities<{
	bootstrap: {
		input: any
		state: any
	}
	// player: {
	// 	input: any
	// 	state: {
	// 		coordinates: Vec2Array
	// 	}
	// }
	// level: {
	// 	input: any
	// 	state: {
	// 		seed: number
	// 	}
	// }
}>

