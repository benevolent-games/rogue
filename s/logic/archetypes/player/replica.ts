
import {PlayerData} from "./data.js"
import {replica} from "../../framework/replication/types.js"

export const playerReplica = replica<PlayerData>(
	({id, replicator}) => {

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

