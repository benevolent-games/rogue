
import {deferPromise} from "@benev/slate"
import {Glacier} from "./utils/glacier.js"
import {constants} from "../../constants.js"
import {Dungeon} from "../dungeons/dungeon.js"
import {Awareness} from "./utils/awareness.js"
import {DungeonStore} from "../dungeons/store.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {MortalRegistry} from "../commons/mortal/registry.js"

export class Station {
	#dungeon: Dungeon | null = null
	#readyPromise = deferPromise<void>()

	// fixed timestep for simulation
	readonly seconds = 1 / constants.sim.tickRate

	importantEntities = new Set<number>()
	entityHashgrid = new ZenGrid<number>(constants.sim.hashgridExtent)
	mortals = new MortalRegistry()
	awareness = new Awareness()
	glacier = new Glacier(this.awareness)

	constructor(public dungeonStore: DungeonStore) {}

	update(_tick: number) {
		this.glacier.recompute()
	}

	get ready() {
		return this.#readyPromise.promise
	}

	set dungeon(dungeon: Dungeon) {
		this.#dungeon = dungeon
		this.#readyPromise.resolve()
	}

	get dungeon() {
		if (!this.#dungeon)
			throw new Error("dungeon is not set")
		return this.#dungeon
	}

	get possibleDungeon() {
		return this.#dungeon
	}
}

