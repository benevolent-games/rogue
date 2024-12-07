
import {DemoStation} from "../station.js"
import {GameEntities} from "./entities.js"
import {Replicas} from "../../framework/replication/types.js"

import {soldierReplica} from "./soldier/replica.js"
import {landmineReplica} from "./landmine/replica.js"
import {bootstrapReplica} from "./bootstrap/replica.js"

export const demoReplicas: Replicas<GameEntities, DemoStation> = {
	bootstrap: bootstrapReplica,
	landmine: landmineReplica,
	soldier: soldierReplica,
}

