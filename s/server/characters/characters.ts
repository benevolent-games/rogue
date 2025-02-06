
import {Proof} from "@authlocal/authlocal"
import {Character} from "./types.js"
import {Keychain} from "../utils/keychain.js"
import {CharacterDatabase} from "./database.js"

export class Characters {
	database = new CharacterDatabase()

	api = (_keychain: Keychain, proof: Proof) => ({
		list: async() => {
			return this.database.listForOwner(proof.thumbprint)
		},

		add: async(character: Character) => {
			return this.database.add(character)
		},

		delete: async(id: string) => {
			return this.database.delete(id)
		},
	})
}

