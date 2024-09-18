
import {replica} from "./framework/replication/types.js"

export class Realm {
	static replica = replica<Realm>()
}

