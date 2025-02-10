
import {Kv} from "../../../packs/kv/kv.js"
import {KvStore} from "../../../packs/kv/store.js"
import {CharacterOwnershipRecord, CharacterRecord} from "./types.js"

export class CharacterDatabase {
	#characters: KvStore<CharacterRecord>
	#ownership: KvStore<CharacterOwnershipRecord>

	constructor(public kv: Kv) {
		this.#characters = kv.store("characters.records")
		this.#ownership = kv.store("characters.ownership")
	}

	async list(owner: string) {
		const ownership = await this.#ownership
			.guarantee(owner, () => ({characterIds: []}))
		return (await this.#characters.gets(...ownership.characterIds))
			.filter(c => !!c)
	}

	async get(id: string) {
		return this.#characters.get(id)
	}

	async add(character: CharacterRecord) {
		if (await this.#characters.has(character.id))
			throw new Error("character record already exists for this id")

		await this.#characters.put(character.id, character)
	}

	async delete(characterId: string) {
		
	}

	async changeOwnership(id: string, newOwner: string) {}
}

// export class CharacterDatabase {
// 	#characters = new Map2<string, Character>()
// 	#owners = new Map2<string, Set<Character>>()
//
// 	#getOwnerSet(owner: string) {
// 		return this.#owners.guarantee(owner, () => new Set())
// 	}
//
// 	async listForOwner(owner: string) {
// 		return [...this.#getOwnerSet(owner)]
// 	}
//
// 	async get(id: string) {
// 		return this.#characters.get(id)
// 	}
//
// 	async require(id: string) {
// 		return this.#characters.require(id)
// 	}
//
// 	async add(character: Character) {
// 		this.#characters.set(character.id, character)
// 		this.#getOwnerSet(character.owner).add(character)
// 	}
//
// 	async delete(id: string) {
// 		const character = this.#characters.get(id)
// 		if (character) {
// 			this.#characters.delete(id)
// 			this.#getOwnerSet(character.owner).delete(character)
// 		}
// 	}
//
// 	async updateOwner(id: string, newOwner: string) {
// 		const character = this.#characters.require(id)
//
// 		// delete old ownership
// 		this.#getOwnerSet(character.owner).delete(character)
//
// 		// establish new ownership
// 		character.owner = newOwner
// 		this.#getOwnerSet(newOwner).add(character)
//
// 		return character
// 	}
// }

