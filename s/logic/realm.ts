
import {World} from "../tools/babylon/world.js"
import {replica} from "./framework/replication/types.js"

export class Realm {
	static replica = replica<Realm>()

	constructor(public world: World) {}
}

