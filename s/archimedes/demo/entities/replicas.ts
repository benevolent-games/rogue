
import {Station} from "../station.js"
import {GameEntities} from "./entities.js"
import {bootstrapReplica} from "./bootstrap/replica.js"
import {Replicas} from "../../framework/replication/types.js"

export const replicas: Replicas<GameEntities, Station> = {
	bootstrap: bootstrapReplica,
}

