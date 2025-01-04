
import {Dungeon} from "../dungeons/dungeon.js"
import {DungeonStore} from "../dungeons/store.js"

export class Station {
	#dungeon: Dungeon | null = null

	constructor(public dungeonStore: DungeonStore) {}

	set dungeon(dungeon: Dungeon) {
		this.#dungeon = dungeon
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

