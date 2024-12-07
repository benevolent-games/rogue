
import {Vec2Array} from "@benev/toolbox"
import {AsEntities} from "../../framework/parts/types.js"

export type GameEntities = AsEntities<{

	landmine: {
		state: {location: Vec2Array, detonationProximity: number}
		input: {data: null, message: null}
	}

	soldier: {
		state: {location: Vec2Array}
		input: {data: {movement: Vec2Array}, message: null}
	}

}>

