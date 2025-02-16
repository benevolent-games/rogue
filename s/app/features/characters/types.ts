
export type Character = {
	id: string
	ownerId: string
}

export type Owner = {
	id: string
	characterIds: string[]
}

///////////////////////////////

export type CharacterScope = "custodian" | "arbiter"

export type CharacterAccess = {
	scope: CharacterScope
	character: Character
}

