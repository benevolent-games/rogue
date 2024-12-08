
import {Realm} from "../realm/realm.js"
import {RogueEntities} from "./entities.js"
import {Replicas} from "../../archimedes/exports.js"

import {crusaderReplica} from "./crusader/replica.js"
import {dungeonReplica} from "./dungeon/replica.js"

export const demoReplicas: Replicas<RogueEntities, Realm> = {
	crusader: crusaderReplica,
	dungeon: dungeonReplica,
}

