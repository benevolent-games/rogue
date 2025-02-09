
import {Map2, Text} from "@benev/slate"
import {ByteCore} from "../parts/types.js"

export class MemCore implements ByteCore {
	#map = new Map2<string, Uint8Array>()

	#stringkey(bytes: Uint8Array) {
		return Text.string(bytes)
	}

	async put(key: Uint8Array, value: Uint8Array) {
		this.#map.set(this.#stringkey(key), value)
	}

	async get(key: Uint8Array) {
		return this.#map.get(this.#stringkey(key))
	}

	async require(key: Uint8Array) {
		return this.#map.require(this.#stringkey(key))
	}

	async guarantee(key: Uint8Array, make: () => Uint8Array) {
		return this.#map.guarantee(this.#stringkey(key), make)
	}

	async del(key: Uint8Array) {
		this.#map.delete(this.#stringkey(key))
	}
}

