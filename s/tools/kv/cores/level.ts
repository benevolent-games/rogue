
import {Level} from "level"
import {ByteCore} from "../parts/types.js"

export class LevelCore implements ByteCore {
	#db: Level<Uint8Array, Uint8Array>

	constructor(path: string) {
		this.#db = new Level(path, {keyEncoding: "view", valueEncoding: "view"})
	}

	async put(key: Uint8Array, value: Uint8Array) {
		return this.#db.put(key, value)
	}

	async require(key: Uint8Array) {
		return this.#db.get(key)
	}

	async get(key: Uint8Array) {
		try {
			return this.#db.get(key)
		}
		catch (error) {
			return undefined
		}
	}

	async del(key: Uint8Array) {
		return this.#db.del(key)
	}
}

