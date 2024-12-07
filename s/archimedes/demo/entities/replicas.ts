
import {DemoRealm} from "../realm.js"
import {GameEntities} from "./entities.js"
import {Replicas} from "../../framework/replication/types.js"

import {soldierReplica} from "./soldier/replica.js"
import {landmineReplica} from "./landmine/replica.js"

export const demoReplicas: Replicas<GameEntities, DemoRealm> = {
	landmine: landmineReplica,
	soldier: soldierReplica,
}

