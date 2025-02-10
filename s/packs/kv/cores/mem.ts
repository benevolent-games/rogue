
import {Map2} from "@benev/slate"
import {stringkey} from "../utils/stringkey.js"
import {ByteCore, FlexKey} from "../parts/types.js"

export class MemCore implements ByteCore {
	#map = new Map2<string, Uint8Array>()

	async put(key: FlexKey, value: Uint8Array) {
		this.#map.set(stringkey(key), value)
	}

	async puts(...entries: [FlexKey, Uint8Array][]) {
		for (const [key, value] of entries)
			this.put(key, value)
	}

	async get(key: FlexKey) {
		return this.#map.get(stringkey(key))
	}

	async gets(...keys: FlexKey[]) {
		return Promise.all(keys.map(key => this.get(key)))
	}

	async require(key: FlexKey) {
		return this.#map.require(stringkey(key))
	}

	async requires(...keys: FlexKey[]) {
		return Promise.all(keys.map(key => this.require(key)))
	}

	async guarantee(key: FlexKey, make: () => Uint8Array) {
		return this.#map.guarantee(stringkey(key), make)
	}

	async del(...keys: FlexKey[]) {
		for (const key of keys)
			this.#map.delete(stringkey(key))
	}
}

