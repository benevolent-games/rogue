
import {deferPromise, signal} from "@benev/slate"
import {Character} from "../../../app/features/characters/parts/character.js"

export class CharacterChooser {
	resolvers = signal<null | ((character: Character) => void)[]>(null)

	async request() {
		const deferred = deferPromise<Character>()
		this.resolvers.value = [
			...(this.resolvers.value ?? []),
			deferred.resolve,
		]
		return deferred.promise
	}

	get choose() {
		const resolvers = this.resolvers.value
		if (resolvers && resolvers.length > 0)
			return (character: Character) => {
				resolvers.forEach(resolve => resolve(character))
				this.resolvers.value = null
			}
	}
}

