
import {PlayerData} from "./data.js"
import {Replica} from "../../replication/types.js"

export const playerReplica: Replica<PlayerData> = (id, replicator) => {
	void id
	void replicator

	return {
		replicate(data) {
			void data
		},
		dispose() {},
	}
}

