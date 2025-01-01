
import {Dungeon} from "../dungeons/dungeon.js"

export class Station {
	#dungeon: Dungeon | null = null

	set dungeon(dungeon: Dungeon) {
		this.#dungeon = dungeon
	}

	get dungeon() {
		if (!this.#dungeon)
			throw new Error("dungeon is not set")
		return this.#dungeon
	}
}

