
import {Vec2Array} from "@benev/toolbox"
import {BipedState} from "../../commons/biped/types.js"
import {CharacterRecord} from "../../../app/features/characters/types.js"

export type CrusaderState = {
	author: number
	biped: BipedState
	character: CharacterRecord
}

export type CrusaderInputData = {
	attack: boolean
	block: number
	sprint: boolean
	rotation: number
	movementIntent: Vec2Array
}

