
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
	cameraman: Cameraman
	onFilesDropped = pubsub<[File[]]>()
	playerPosition = Vec3.zero()

	constructor(
			public world: World,
			public env: Env,
			public glbs: Glbs,
		) {
		this.cameraman = new Cameraman(env)
	}

	static async load() {
		const world = await World.load()
		const env = makeEnvironment(world)
		const glbs = await Glbs.load(world)
		return new this(world, env, glbs)
	}

	instance(source: Mesh) {
		return source.createInstance("instance")
	}
}

