
import {Hex} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {Future, Proof} from "@authlocal/authlocal"

import {Keychain} from "../security/keychain.js"
import {CharacterDatabase} from "./database.js"
import {secureLogin} from "../security/secure-login.js"
import {randyBuffer} from "../../../tools/temp/randy-bytes.js"
import {Character, CharacterAccess, CharacterScope} from "./types.js"
import {secureCharacterAccess} from "./utils/secure-character-access.js"

export class Characters {
	database = new CharacterDatabase()
	constructor(public keychain: Keychain) {}
	api = () => makeCharacterApi({
		database: this.database,
		keychain: this.keychain,
	})
}

export function makeCharacterApi({keychain, database}: {
		keychain: Keychain,
		database: CharacterDatabase,
	}) {

	const signToken = (character: Character, scope: CharacterScope, days: number) =>
		keychain.signLicense<CharacterAccess>(
			{character, scope},
			Future.days(days),
		)

	const signCustodianToken = (character: Character) =>
		signToken(character, "custodian", 7)

	const signArbiterToken = (character: Character) =>
		signToken(character, "arbiter", 1)

	return {
		owner: secureLogin((proof: Proof) => ({

			/** list all characters owned by this user, and return character custodian tokens */
			async list() {
				const list = await database.listForOwner(proof.thumbprint)
				return Promise.all(
					list.map(character => signCustodianToken(character))
				)
			},

			/** create a character based on a seed */
			async create(draft: {seed: number}) {
				const randy = new Randy(draft.seed)
				const bytes = randyBuffer(randy, 32)
				const id = Hex.string(bytes)
				const character: Character = {id, owner: proof.thumbprint}
				await database.add(character)
				return signCustodianToken(character)
			},

			/** permanently delete a character */
			async delete(id: string) {
				return database.delete(id)
			},

			/** create a token to give to a gameplay host, who can report equipment changes and death */
			async signArbiterToken(id: string) {
				const character = await database.require(id)
				return signArbiterToken(character)
			},
		})),

		custodian: secureCharacterAccess(keychain, "custodian", character => ({

			/** transfer a character to be owned by a new account */
			async changeOwnership(newOwner: string) {
				const bytes = Hex.bytes(newOwner)
				if (bytes.length !== 32) throw new Error("invalid newOwner id")
				const updatedCharacter = await database.updateOwner(character.id, newOwner)
				return signCustodianToken(updatedCharacter)
			},
		})),

		arbiter: secureCharacterAccess(keychain, "arbiter", character => ({

			/** report a player as dead */
			async kill() {
				database.delete(character.id)
			},
		})),
	}
}

