
import {CharacterAccess} from "../types.js"

export type CharacterSource = {
	decree: string
	access: CharacterAccess
}

export type CharacterCardVariety = (
	| "standard"
	| "creator"
	| "foreign"
)

