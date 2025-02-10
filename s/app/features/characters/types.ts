
export type CharacterRecord = {
	id: string
}

export type CharacterOwnershipRecord = {
	characterIds: string[]
}

///////////////////////////////

export type Character = {
	id: string
	ownerId: string
}

export type CharacterScope = "custodian" | "arbiter"

export type CharacterAccess = {
	scope: CharacterScope
	character: Character
}

