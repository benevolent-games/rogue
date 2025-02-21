
import {Hex} from "@benev/slate"
import {Future, Proof} from "@authlocal/authlocal"

import {Kv} from "../../../packs/kv/kv.js"
import {CharacterDatabase} from "./database.js"
import {secureLogin} from "../security/secure-login.js"
import {DecreeSigner} from "../security/decree/signer.js"
import {Character, CharacterAccess, CharacterScope} from "./types.js"
import {secureCharacterAccess} from "./utils/secure-character-access.js"

export async function makeCharacterApi(kv: Kv, signer: DecreeSigner) {
	const database = new CharacterDatabase(kv)

	const signToken = (character: Character, scope: CharacterScope, days: number) =>
		signer.sign<CharacterAccess>(
			{character, scope},
			{expiresAt: Future.days(days)},
		)

	const signCustodianToken = (character: Character) =>
		signToken(character, "custodian", 7)

	const signArbiterToken = (character: Character) =>
		signToken(character, "arbiter", 1)

	return {

		/** an owner has a list of characters they can manage */
		owner: secureLogin((proof: Proof) => ({

			/** list all characters owned by this user, and return character custodian tokens */
			async list() {
				const ownerId = proof.thumbprint
				const characters = await database.list(ownerId)
				return Promise.all(
					characters.map(character => signCustodianToken(character))
				)
			},

			/** create a character */
			async create() {
				const id = Hex.random(32)
				const character: Character = {id, ownerId: proof.thumbprint}
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

		/** a custodian has the ability to change the ownership of a character **/
		custodian: secureCharacterAccess(signer, "custodian", character => ({

			/** transfer a character to be owned by a new account */
			async changeOwnership(newOwnerId: string) {
				const bytes = Hex.bytes(newOwnerId)
				if (bytes.length !== 32) throw new Error("invalid newOwner id")
				const updatedCharacter = await database.changeOwnership(character.id, newOwnerId)
				return signCustodianToken(updatedCharacter)
			},
		})),

		/** an arbiter has the ability to report gameplay changes to characters, like the gains of skills and equipment, or death **/
		arbiter: secureCharacterAccess(signer, "arbiter", character => ({

			/** report a player as dead */
			async kill() {
				await database.delete(character.id)
			},
		})),
	}
}

