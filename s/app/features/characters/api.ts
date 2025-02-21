
import {Hex} from "@benev/slate"
import {Future} from "@authlocal/authlocal"

import {CharacterDatabase} from "./database.js"
import {DatabaseSchema} from "../schema/database.js"
import {DecreeSigner} from "../security/decree/signer.js"
import {secureAccount} from "../security/secure-account.js"
import {CharacterRecord, CharacterAccess, CharacterScope, CharacterGenesis} from "./types.js"
import { CharacterDecrees } from "./utils/character-decrees.js"

export async function makeCharacterApi(schema: DatabaseSchema, signer: DecreeSigner) {
	const database = new CharacterDatabase(schema)

	return secureAccount(signer, account => ({

		/** list all characters owned by this user, and return character custodian tokens */
		async list() {
			const ownerId = account.thumbprint
			const characters = await database.list(ownerId)
			return Promise.all(
				characters.map(character => CharacterDecrees.signForCustodian(signer, character))
			)
		},

		/** create a character */
		async create(genesis: CharacterGenesis) {
			const id = Hex.random(32)
			const character: CharacterRecord = {id, ownerId: account.thumbprint, genesis}
			await database.add(character)
			return CharacterDecrees.signForCustodian(signer, character)
		},

		/** claim an existing character */
		async claim(custodianDecree: string) {
			const character = await CharacterDecrees.verify(signer, custodianDecree, "custodian")
			const updatedCharacter = await database.changeOwnership(character.id, account.thumbprint)
			return CharacterDecrees.signForCustodian(signer, updatedCharacter)
		},

		/** permanently delete a character */
		async delete(id: string) {
			return database.delete(id)
		},

		/** create a token to give to a gameplay host, who can report equipment changes and death */
		async getArbiterDecree(id: string) {
			const character = await database.require(id)
			return CharacterDecrees.signForArbiter(signer, character)
		},

		/** report a player as dead */
		async kill(arbiterDecree: string) {
			const character = await CharacterDecrees.verify(signer, arbiterDecree, "arbiter")
			await database.delete(character.id)
		},
	}))
}

