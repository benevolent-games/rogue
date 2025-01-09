
import "./utils/fix-babylon-draco-urls.js"
import "@benev/toolbox/x/babylon-side-effects.js"

import {Vec3} from "@benev/toolbox"
import {deferPromise, pubsub, Trashbin} from "@benev/slate"
import {Constants} from "@babylonjs/core/Engines/constants.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

import {Glbs} from "./glbs.js"
import {Stuff} from "./utils/stuff.js"
import {Lighting} from "./utils/lighting.js"
import {makeTact} from "./utils/make-tact.js"
import {Cameraman} from "./utils/cameraman.js"
import {GameStats} from "./parts/game-stats.js"
import {Indicators} from "./utils/indicators.js"
import {DungeonStore} from "../dungeons/store.js"
import {World} from "../../tools/babylon/world.js"
import {UserInputs} from "./inputs/user-inputs.js"
import {CoolMaterials} from "./utils/cool-materials.js"
import {CapsuleBuddies} from "./utils/capsule-buddies.js"
import { Cursor } from "./parts/cursor.js"

export class Realm {
	stats = new GameStats()

	materials: CoolMaterials
	buddies: CapsuleBuddies
	cameraman: Cameraman
	indicators: Indicators
	stuff: Stuff
	userInputs: UserInputs
	cursor: Cursor

	tact = makeTact(window)
	playerPosition = Vec3.zero()
	onFilesDropped = pubsub<[File[]]>()

	ready = deferPromise<void>()

	#trashbin = new Trashbin()

	constructor(
			public world: World,
			public lighting: Lighting,
			public glbs: Glbs,
			public dungeonStore: DungeonStore,
		) {

		this.buddies = new CapsuleBuddies(world.scene)
		this.materials = new CoolMaterials(world.scene)
		this.indicators = new Indicators(world.scene, this.materials)
		this.stuff = new Stuff(world.scene, this.materials)
		this.cameraman = new Cameraman(world.scene, lighting)
		this.userInputs = new UserInputs(this.cameraman)
		this.cursor = new Cursor(this.cameraman)
		this.#trashbin.disposer(this.userInputs.attach(world.canvas))
		this.#trashbin.disposer(this.cursor.attach(world.canvas))
	}

	static async load(dungeonStore: DungeonStore) {
		const world = await World.load()
		const lighting = new Lighting(world.scene)
		const glbs = await Glbs.load(world)
		return new this(world, lighting, glbs, dungeonStore)
	}

	async loadPostProcessShader(name: string, url: string) {
		await NodeMaterial.ParseFromFileAsync(name, url, this.world.scene)
			.then(material => material.createPostProcess(
				this.cameraman.camera,
				1.0,
				Constants.TEXTURE_LINEAR_LINEAR,
			))
	}

	tick() {
		this.cameraman.tick()
		this.cursor.tick()
		this.#updateStats()
	}

	#updateStats() {
		this.stats.framerate.time = this.world.engine.getFps()
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

