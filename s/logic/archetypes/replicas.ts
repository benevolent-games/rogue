
import {simulas} from "./simulas.js"
import {asReplicas} from "../types.js"
import {playerReplica} from "./player/replica.js"

export const replicas = asReplicas<typeof simulas>({
	player: playerReplica,
})

