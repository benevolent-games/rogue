
import {Map2} from "@benev/slate"

import {DungeonLayout} from "./layout.js"
import {quickHash} from "../../tools/quick-hash.js"
import {DungeonOptions} from "./layouting/types.js"

/** Stores generated dungeon layouts to help us avoid repeating the same dungeon redundantly in different contexts */
export class DungeonStore {
	#dungeons = new Map2<number, DungeonLayout>

	static hash(options: DungeonOptions) {
		const json = JSON.stringify(options)
		return quickHash(json)
	}

	make(options: DungeonOptions) {
		const hash = DungeonStore.hash(options)
		return this.#dungeons.guarantee(hash, () => new DungeonLayout(options))
	}

	delete(options: DungeonOptions) {
		const hash = DungeonStore.hash(options)
		this.#dungeons.delete(hash)
	}

	clear() {
		this.#dungeons.clear()
	}
}

