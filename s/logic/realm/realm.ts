
import {makeTact} from "./utils/make-tact.js"
import {World} from "../../tools/babylon/world.js"
import {replica} from "../framework/replication/types.js"

export class Realm {
	static replica = replica<Realm>()
	tact = makeTact(window)
	constructor(public world: World) {}
}

