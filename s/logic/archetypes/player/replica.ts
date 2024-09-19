
import {Realm} from "../../realm.js"
import {PlayerArchetype} from "./types.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({id, replicator, realm}) => {

	return {
		data: {movement: [0, 0]},

		replicate({feed, feedback}) {
			feedback.data = {movement: [1, 1]}
		},

		dispose() {},
	}
})

