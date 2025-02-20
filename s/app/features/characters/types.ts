
/** seeds the creation of a character */
export type CharacterGenesis = {
	seed: string
}

/** database record of a character */
export type CharacterRecord = {
	id: string
	ownerId: string
	genesis: CharacterGenesis
}

export type Owner = {
	id: string
	characterIds: string[]
}

///////////////////////////////

export type CharacterScope = "custodian" | "arbiter"

export type CharacterAccess = {
	scope: CharacterScope
	character: CharacterRecord
}

