
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

	async puts(...entries: [FlexKey, Uint8Array][]) {
		return this.#db.batch(
			entries.map(([key, value]) =>
				({type: "put", key: bytekey(key), value}))
		)
	}

	async get(key: FlexKey): Promise<Uint8Array | undefined> {
		return this.#db.get(bytekey(key))
	}

	async gets(...keys: FlexKey[]): Promise<(Uint8Array | undefined)[]> {
		return this.#db.getMany(keys.map(bytekey))
	}

	async require(key: FlexKey) {
		const value = await this.#db.get(bytekey(key))
		if (value === undefined)
			throw new Error(`required key not found`)
		return value
	}

	async requires(...keys: FlexKey[]) {
		const values = await this.gets(...keys)
		for (const value of values)
			if (value === undefined)
				throw new Error(`required key not found`)
		return values as any as Promise<Uint8Array[]>
	}

	async guarantee(key: FlexKey, make: () => Uint8Array) {
		let value: Uint8Array | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.put(key, value)
		}
		return value
	}

	async del(...keys: FlexKey[]) {
		if (keys.length === 0)
			return undefined

		return (keys.length === 1)
			? this.#db.del(bytekey(keys[0]))
			: this.#db.batch(keys.map(key => ({
				type: "del",
				key: bytekey(key),
			})))
	}
}

