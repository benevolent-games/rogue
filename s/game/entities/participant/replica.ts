
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {Character} from "../../../app/features/characters/parts/character.js"
import {replica} from "../../../packs/archimedes/framework/replication/types.js"

export const participantReplica = replica<RogueEntities, Realm>()<"participant">(
	({realm, replicator, getState}) => {

	const {author} = getState()
	const inControl = author === replicator.author
	const {spawn} = realm.userInputs.grip.state.normal

	let chosenCharacter: Character | null = null

	if (inControl) {
		realm.characterChooser.request()
			.then(character => { chosenCharacter = character })
	}

	return {
		gatherInputs: () => {
			const state = getState()
			if (inControl && !state.alive && chosenCharacter) {
				const character = chosenCharacter
				chosenCharacter = null
				return [{spawnRequest: {character}}]
			}
			return undefined
		},
		replicate: () => {
			const state = getState()
			if (inControl && !state.alive && spawn.pressed.changed && spawn.pressed.value) {
				realm.characterChooser.request()
					.then(character => { chosenCharacter = character })
			}
		},
		dispose: () => {},
	}
})

