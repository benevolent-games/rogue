
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
import {Averager} from "../../tools/averager.js"
import {Indicators} from "./utils/indicators.js"
import {DungeonStore} from "../dungeons/store.js"
import {UserInputs} from "./inputs/user-inputs.js"
import {World} from "../../tools/babylon/world.js"
import {PimsleyPool} from "./pimsley/pimsley-pool.js"
import {DebugCapsules} from "./utils/debug-capsules.js"
import {CoolMaterials} from "./utils/cool-materials.js"
import {InputControls} from "./inputs/input-controls.js"
import {CapsuleBuddies} from "./utils/capsule-buddies.js"
import {AnimOrchestrator} from "./parts/anim-orchestrator.js"
import {BipedIndicatorStore} from "../commons/biped/utils/biped-indicators.js"

const debug = false

export class Realm {
	frame = signal(0)

	stats = new GameStats()
	userInputs = new UserInputs(window)
	playerPosition = Vec3.zero()
	onFilesDropped = pubsub<[File[]]>()
	ready = deferPromise<void>()

	pimsleyPool: PimsleyPool
	materials: CoolMaterials
	buddies: CapsuleBuddies
	debugCapsules: DebugCapsules
	cameraman: Cameraman
	indicators: Indicators
	stuff: Stuff
	inputControls: InputControls
	cursor: Cursor
	animOrchestrator: AnimOrchestrator
	bipedIndicatorStore: BipedIndicatorStore

	#cursorGraphic: Prop | null
	#trash = new Trashbin()

	constructor(
			public world: World,
			public lighting: Lighting,
			public glbs: Glbs,
			public dungeonStore: DungeonStore,
		) {

		const {scene} = world

		this.pimsleyPool = new PimsleyPool(this, glbs.pimsleyContainer)
		this.buddies = new CapsuleBuddies(scene)
		this.materials = new CoolMaterials(scene)
		this.debugCapsules = new DebugCapsules(scene, this.materials)
		this.indicators = new Indicators(scene, this.materials)
		this.stuff = new Stuff(scene, this.materials)
		this.cameraman = new Cameraman(scene, lighting)
		this.inputControls = new InputControls(this.cameraman, this.userInputs)
		this.cursor = new Cursor(this.cameraman)
		this.animOrchestrator = new AnimOrchestrator(this.cameraman.smoothed.pivot)
		this.bipedIndicatorStore = new BipedIndicatorStore(scene, this.materials)

		this.#cursorGraphic = debug
			? this.indicators.cursor.instance()
			: null

		this.pimsleyPool.preload(40)

		this.#trash.disposable(this.debugCapsules)
		this.#trash.disposable(this.bipedIndicatorStore)
		this.#trash.disposer(this.inputControls.attach(world.canvas))
		this.#trash.disposer(this.cursor.attach(world.canvas))
	}

	#millisecondsAverager = new Averager(10)

	get milliseconds() {
		return this.#millisecondsAverager.average
	}

	// dynamic framerate timestep for visual animations and replication
	get seconds() {
		return this.milliseconds / 1000
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
		this.#millisecondsAverager.add(this.world.gameloop.delta.ms)

		this.userInputs.poll()
		this.inputControls.tick()
		this.cameraman.tick(this.seconds)
		this.cursor.tick()
		this.animOrchestrator.centerpoint = this.cameraman.smoothed.pivot

		this.animOrchestrator.animos.sort()
		this.animOrchestrator.animate(this.seconds)

		if (this.#cursorGraphic)
			this.#cursorGraphic.position.set(...this.cursor.position.array())

		this.#updateStats()
		this.frame.value += 1
	}

	#updateStats() {
		this.stats.framerate.time = this.world.engine.getFps()
	}

	dispose() {
		this.#trash.dispose()
		this.userInputs.dispose()
		this.pimsleyPool.dispose()
	}
}

