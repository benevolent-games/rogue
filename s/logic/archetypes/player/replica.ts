
import {Realm} from "../../realm.js"
import {PlayerArchetype} from "./types.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({id, replicator, realm}) => {

	return {
		replicate({feed, feedback}) {

			// facts from the simulation
			feed.facts

			// broadcasts from the simulation
			feed.broadcasts

			// update the lossy channel
			feedback.data = {thumbstick: [1, 2]}

			// send a message on the lossless channel
			feedback.memo({action: "respawn"})
		},

		dispose() {},
	}
})

