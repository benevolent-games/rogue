
import {DungeonOptions} from "../dungeons/layouting/types.js"
import {AsEntities} from "../../archimedes/framework/parts/types.js"
import {CrusaderInputData, CrusaderState} from "./crusader/types.js"

export type RogueEntities = AsEntities<{
	dungeon: {
		state: {options: DungeonOptions}
		input: undefined
	}
	crusader: {
		state: CrusaderState
		input: CrusaderInputData
	}
}>

