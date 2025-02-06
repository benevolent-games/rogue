
import {Map2} from "@benev/slate"
import {Character} from "./types.js"

export class CharacterDatabase {
	#characters = new Map2<string, Character>()
	#owners = new Map2<string, Set<Character>>()

	async listForOwner(owner: string) {
		return [...this.#owners.guarantee(owner, () => new Set())]
	}

	async get(id: string) {
		return this.#characters.get(id)
	}

	async add(character: Character) {
		this.#characters.set(character.id, character)
		this.#owners
			.guarantee(character.owner, () => new Set())
			.add(character)
	}

	async delete(id: string) {
		const character = this.#characters.get(id)
		if (character) {
			this.#characters.delete(id)
			this.#owners
				.guarantee(character.owner, () => new Set())
				.delete(character)
		}
	}
}

