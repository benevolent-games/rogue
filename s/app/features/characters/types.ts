
export type Character = {
	id: string
	owner: string
}

export type CharacterScope = "custodian" | "arbiter"

export type CharacterAccess = {
	scope: CharacterScope
	character: Character
}

