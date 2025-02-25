
import {CharacterRecord} from "../../../app/features/characters/types.js"

export type ParticipantState = {
	author: number
	alive: null | {
		character: CharacterRecord
		crusaderEntityId: number
	}
}

export type ParticipantInputState = {
	spawnRequest: null | {
		character: CharacterRecord
	}
}

