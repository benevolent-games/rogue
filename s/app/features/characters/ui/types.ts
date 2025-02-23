
import {CharacterAccess} from "../types.js"

export type CharacterSource = {
	decree: string
	access: CharacterAccess
}

export type CharacterSituation = (
	| "creatable"
	| "selectable"
	| "manageable"
	| "claimable"
)

