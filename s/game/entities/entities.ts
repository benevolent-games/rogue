
import {BotState} from "./bot/types.js"
import {BlockState} from "./block/state.js"
import {DungeonOptions} from "../dungeons/layouting/types.js"
import {CrusaderInputData, CrusaderState} from "./crusader/types.js"
import {AsEntities} from "../../packs/archimedes/framework/parts/types.js"
import {ParticipantInputState, ParticipantState} from "./participant/types.js"

export type RogueEntities = AsEntities<{
	dungeon: {
		state: {options: DungeonOptions}
		input: undefined
	}
	participant: {
		state: ParticipantState
		input: ParticipantInputState
	}
	crusader: {
		state: CrusaderState
		input: CrusaderInputData
	}
	block: {
		state: BlockState
		input: undefined
	}
	bot: {
		state: BotState
		input: undefined
	}
}>

