
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

	async get(key: Uint8Array) {
		try {
			return this.#db.get(key)
		}
		catch (error) {
			return undefined
		}
	}

	async require(key: Uint8Array) {
		return this.#db.get(key)
	}

	async guarantee(key: Uint8Array, make: () => Uint8Array) {
		let value: Uint8Array | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.put(key, value)
		}
		return value
	}

	async del(key: Uint8Array) {
		return this.#db.del(key)
	}
}

