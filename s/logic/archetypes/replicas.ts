
import {simulas} from "./simulas.js"
import {playerReplica} from "./player/replica.js"
import {asReplicas} from "../framework/replication/types.js"

export const replicas = asReplicas<typeof simulas>({
	player: playerReplica,
})

