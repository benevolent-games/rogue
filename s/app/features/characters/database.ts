
import {dedupe} from "@benev/slate"
import {Kv} from "../../../packs/kv/kv.js"
import {CharacterRecord, Owner} from "./types.js"

export class CharacterDatabase {
	#owners: Kv<Owner>
	#characters: Kv<CharacterRecord>

	constructor(public kv: Kv) {
		this.#characters = kv.namespace("characters.records")
		this.#owners = kv.namespace("characters.ownership")
	}

	#helpers = {
		addCharacterIdToOwner(owner: Owner, characterId: string) {
			owner.characterIds = dedupe([...owner.characterIds, characterId])
		},
		removeCharacterIdFromOwner(owner: Owner, characterId: string) {
			owner.characterIds = owner.characterIds.filter(id => id !== characterId)
		},
	}

	async #getOwner(id: string) {
		return this.#owners
			.guarantee(id, () => ({id, characterIds: []}))
	}

	async list(ownerId: string) {
		const owner = await this.#getOwner(ownerId)
		return this.#characters.requires(...owner.characterIds)
	}

	async get(id: string) {
		return this.#characters.get(id)
	}

	async require(id: string) {
		return this.#characters.require(id)
	}

	async add(character: CharacterRecord) {
		if (await this.#characters.has(character.id))
			throw new Error("character record already exists for this id")

		// update owner
		const owner = await this.#getOwner(character.ownerId)
		this.#helpers.addCharacterIdToOwner(owner, character.id)

		// write to database
		await this.kv.transaction(() => [
			this.#owners.write.put(owner.id, owner),
			this.#characters.write.put(character.id, character),
		])
	}

	async delete(id: string) {
		const character = await this.#characters.get(id)
		if (character) {

			// update owner
			const owner = await this.#getOwner(character.ownerId)
			this.#helpers.removeCharacterIdFromOwner(owner, character.id)

			// write to database
			await this.kv.transaction(() => [
				this.#owners.write.put(owner.id, owner),
				this.#characters.write.del(character.id),
			])
		}
	}

	async changeOwnership(id: string, newOwnerId: string) {
		const character = await this.#characters.require(id)
		const previousOwnerId = character.ownerId

		// assign owner to character
		character.ownerId = newOwnerId

		// add character to new owner
		const newOwner = await this.#getOwner(newOwnerId)
		this.#helpers.addCharacterIdToOwner(newOwner, character.id)

		// remove character from old owner
		const previousOwner = await this.#getOwner(previousOwnerId)
		this.#helpers.removeCharacterIdFromOwner(previousOwner, character.id)

		// write to database
		await this.kv.transaction(() => [
			this.#owners.write.put(newOwner.id, newOwner),
			this.#owners.write.put(previousOwner.id, previousOwner),
			this.#characters.write.put(character.id, character),
		])

		// return the updated character
		return character
	}
}

