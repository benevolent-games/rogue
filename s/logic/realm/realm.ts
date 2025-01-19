
import "./utils/fix-babylon-draco-urls.js"
import "@benev/toolbox/x/babylon-side-effects.js"

import {Prop, Vec3} from "@benev/toolbox"
import {Constants} from "@babylonjs/core/Engines/constants.js"
import {deferPromise, pubsub, signal, Trashbin} from "@benev/slate"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

import {Glbs} from "./glbs.js"
import {Stuff} from "./utils/stuff.js"
import {Cursor} from "./parts/cursor.js"
import {Lighting} from "./utils/lighting.js"
import {Cameraman} from "./utils/cameraman.js"
import {GameStats} from "./parts/game-stats.js"
import {Indicators} from "./utils/indicators.js"
import {DungeonStore} from "../dungeons/store.js"
import {UserInputs} from "./inputs/user-inputs.js"
import {World} from "../../tools/babylon/world.js"
import {CoolMaterials} from "./utils/cool-materials.js"
import {InputControls} from "./inputs/input-controls.js"
import {CapsuleBuddies} from "./utils/capsule-buddies.js"
import {PimsleyFactory} from "./pimsley/pimsley-factory.js"

const debug = false

export class Realm {
	frame = signal(0)

	stats = new GameStats()
	userInputs = new UserInputs(window)
	playerPosition = Vec3.zero()
	onFilesDropped = pubsub<[File[]]>()
	ready = deferPromise<void>()

	pimsleyFactory: PimsleyFactory
	materials: CoolMaterials
	buddies: CapsuleBuddies
	cameraman: Cameraman
	indicators: Indicators
	stuff: Stuff
	inputControls: InputControls
	cursor: Cursor

	#cursorGraphic: Prop | null
	#trashbin = new Trashbin()

	constructor(
			public world: World,
			public lighting: Lighting,
			public glbs: Glbs,
			public dungeonStore: DungeonStore,
		) {

		this.pimsleyFactory = new PimsleyFactory(glbs.pimsleyContainer)
		this.buddies = new CapsuleBuddies(world.scene)
		this.materials = new CoolMaterials(world.scene)
		this.indicators = new Indicators(world.scene, this.materials)
		this.stuff = new Stuff(world.scene, this.materials)
		this.cameraman = new Cameraman(world.scene, lighting)
		this.inputControls = new InputControls(this.cameraman, this.userInputs)
		this.cursor = new Cursor(this.cameraman)

		this.#cursorGraphic = debug
			? this.indicators.cursor.instance()
			: null

		this.#trashbin.disposer(this.inputControls.attach(world.canvas))
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
		this.userInputs.poll()
		this.inputControls.tick()
		this.cameraman.tick()
		this.cursor.tick()

		if (this.#cursorGraphic)
			this.#cursorGraphic.position.set(...this.cursor.position.array())

		this.#updateStats()
		this.frame.value += 1
	}

	#updateStats() {
		this.stats.framerate.time = this.world.engine.getFps()
	}

	dispose() {
		this.#trashbin.dispose()
		this.userInputs.dispose()
		this.pimsleyFactory.dispose()
	}
}

