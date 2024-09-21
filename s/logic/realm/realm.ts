
import {Mesh} from "@babylonjs/core"
import {makeTact} from "./utils/make-tact.js"
import {World} from "../../tools/babylon/world.js"
import {replica} from "../framework/replication/types.js"
import {makeEnvironment} from "./utils/make-environment.js"

export class Realm {
	static replica = replica<Realm>()

	tact = makeTact(window)
	env: ReturnType<typeof makeEnvironment>

	constructor(public world: World) {
		this.env = makeEnvironment(world)
	}

	instance(source: Mesh) {
		const instance = source.createInstance("instance")
		return instance
	}
}

