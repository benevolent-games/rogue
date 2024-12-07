
import {Vec2Array} from "@benev/toolbox"
import {AsEntities} from "../../framework/parts/types.js"

export type GameEntities = AsEntities<{

	bootstrap: {
		state: null
		input: {data: null, message: null}
	}

	landmine: {
		state: {location: Vec2Array, detonationProximity: number}
		input: {data: null, message: null}
	}

	soldier: {
		state: {location: Vec2Array}
		input: {data: null, message: null}
	}
}>

