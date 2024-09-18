
import {replica} from "../../framework/replication/types.js"
import {PlayerData} from "./data.js"

export const playerReplica = replica<PlayerData>((id, replicator) => {
	return {
		replicate(data) {},
		dispose() {},
	}
})

