
import {dedupe} from "@benev/slate"
import {DatabaseSchema} from "../schema/database.js"
import {CharacterRecord, CharacterOwner} from "./types.js"

export class CharacterDatabase {
	constructor(public schema: DatabaseSchema) {}

	#helpers = {
		addCharacterIdToOwner(owner: CharacterOwner, characterId: string) {
			owner.characterIds = dedupe([...owner.characterIds, characterId])
		},
		removeCharacterIdFromOwner(owner: CharacterOwner, characterId: string) {
			owner.characterIds = owner.characterIds.filter(id => id !== characterId)
		},
	}

	async #getOwner(id: string) {
		return this.schema.characters.owners
			.guarantee(id, () => ({id, characterIds: []}))
	}

	async list(ownerId: string) {
		const owner = await this.#getOwner(ownerId)
		return this.schema.characters.records.requires(...owner.characterIds)
	}

	async get(id: string) {
		return this.schema.characters.records.get(id)
	}

	async require(id: string) {
		return this.schema.characters.records.require(id)
	}

	async add(character: CharacterRecord) {
		if (await this.schema.characters.records.has(character.id))
			throw new Error("character record already exists for this id")

		// update owner
		const owner = await this.#getOwner(character.ownerId)
		this.#helpers.addCharacterIdToOwner(owner, character.id)

		// write to database
		await this.schema.root.transaction(() => [
			this.schema.characters.owners.write.put(owner.id, owner),
			this.schema.characters.records.write.put(character.id, character),
		])
	}

	async delete(id: string) {
		const character = await this.schema.characters.records.get(id)
		if (character) {

			// update owner
			const owner = await this.#getOwner(character.ownerId)
			this.#helpers.removeCharacterIdFromOwner(owner, character.id)

			// write to database
			await this.schema.root.transaction(() => [
				this.schema.characters.owners.write.put(owner.id, owner),
				this.schema.characters.records.write.del(character.id),
			])
		}
	}

	async changeOwnership(id: string, newOwnerId: string) {
		const character = await this.schema.characters.records.require(id)
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
		await this.schema.root.transaction(() => [
			this.schema.characters.owners.write.put(newOwner.id, newOwner),
			this.schema.characters.owners.write.put(previousOwner.id, previousOwner),
			this.schema.characters.records.write.put(character.id, character),
		])

		// return the updated character
		return character
	}
}

