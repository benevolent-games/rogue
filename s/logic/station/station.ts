
import {deferPromise} from "@benev/slate"
import {Dungeon} from "../dungeons/dungeon.js"
import {DungeonStore} from "../dungeons/store.js"

export class Station {
	#dungeon: Dungeon | null = null
	#readyPromise = deferPromise<void>()

	constructor(public dungeonStore: DungeonStore) {}

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

