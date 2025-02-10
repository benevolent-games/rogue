
import {Level} from "level"
import {bytekey} from "../utils/bytekey.js"
import {ByteCore, FlexKey} from "../parts/types.js"

export class LevelCore implements ByteCore {
	#db: Level<Uint8Array, Uint8Array>

	constructor(path: string) {
		this.#db = new Level(path, {keyEncoding: "view", valueEncoding: "view"})
	}

	async put(key: FlexKey, value: Uint8Array) {
		return this.#db.put(bytekey(key), value)
	}

	async get(key: FlexKey) {
		try {
			return this.#db.get(bytekey(key))
		}
		catch (error) {
			return undefined
		}
	}

	async require(key: FlexKey) {
		return this.#db.get(bytekey(key))
	}

	async guarantee(key: FlexKey, make: () => Uint8Array) {
		let value: Uint8Array | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.put(key, value)
		}
		return value
	}

	async del(key: FlexKey) {
		return this.#db.del(bytekey(key))
	}
}

