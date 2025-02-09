
import {Realm} from "../realm/realm.js"
import {RogueEntities} from "./entities.js"
import {Replicas} from "../../packs/archimedes/index.js"

import {botReplica} from "./bot/replica.js"
import {blockReplica} from "./block/replica.js"
import {dungeonReplica} from "./dungeon/replica.js"
import {crusaderReplica} from "./crusader/replica.js"

export const replicas: Replicas<RogueEntities, Realm> = {
	block: blockReplica,
	dungeon: dungeonReplica,
	crusader: crusaderReplica,
	bot: botReplica,
}

