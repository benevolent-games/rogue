
import "@benev/toolbox/x/babylon-side-effects.js"

import {Vec3} from "@benev/toolbox"
import {pubsub} from "@benev/slate"
import {Mesh} from "@babylonjs/core"

import {Glbs} from "./glbs.js"
import {makeTact} from "./utils/make-tact.js"
import {Cameraman} from "./utils/cameraman.js"
import {World} from "../../tools/babylon/world.js"
import {Env, makeEnvironment} from "./utils/make-environment.js"

export class Realm {
	tact = makeTact(window)
	env: Env
	cameraman: Cameraman
	onFilesDropped = pubsub<[File[]]>()

	playerPosition = Vec3.zero()

	constructor(public world: World, public glbs: Glbs) {
		this.env = makeEnvironment(world)
		this.cameraman = new Cameraman(this.env)
	}

	instance(source: Mesh) {
		return source.createInstance("instance")
	}
}

