
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../packs/archimedes/framework/replication/types.js"

export const participantReplica = replica<RogueEntities, Realm>()<"participant">(
	({realm, replicator, getState}) => {

	const {author} = getState()
	const inControl = author === replicator.author

	const {spawn} = realm.userInputs.grip.state.normal

	return {
		gatherInputs: () => {
			if (inControl && spawn.pressed.changed && spawn.pressed.value)
				console.log("spawn plz")
			return undefined
		},
		replicate: () => {},
		dispose: () => {},
	}
})

