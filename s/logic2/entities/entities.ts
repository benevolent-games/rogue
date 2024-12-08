
import {AsEntities} from "../../archimedes/framework/parts/types.js"
import {CrusaderInputData, CrusaderState} from "./crusader/types.js"
import {DungeonOptions} from "../../logic/dungeons/layouting/types.js"

export type RogueEntities = AsEntities<{
	dungeon: {
		state: {options: DungeonOptions}
		input: {data: undefined, message: undefined}
	}
	crusader: {
		state: CrusaderState
		input: {data: CrusaderInputData, message: undefined}
	}
}>

