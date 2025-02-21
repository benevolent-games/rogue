
/** seeds the creation of a character */
export type CharacterGenesis = {
	seed: string
}

/** database record of a character */
export type CharacterRecord = {
	id: string
	ownerId: string
	created: number
	genesis: CharacterGenesis
}

export type CharacterOwner = {
	id: string
	characterIds: string[]
}

///////////////////////////////

export type CharacterScope = "custodian" | "arbiter"

export type CharacterAccess = {
	scope: CharacterScope
	character: CharacterRecord
}

