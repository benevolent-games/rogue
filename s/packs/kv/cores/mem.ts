
import {Hex, Map2} from "@benev/slate"
import {Core, Write} from "../parts/core.js"

const stringkey = (bytes: Uint8Array) => Hex.string(bytes)

export class MemCore extends Core {
	#map = new Map2<string, Uint8Array>()

	async gets(...keys: Uint8Array[]) {
		return keys.map(key => this.#map.get(stringkey(key)))
	}

	async has(...keys: Uint8Array[]) {
		return keys.every(key => this.#map.has(stringkey(key)))
	}

	async transaction(...writes: Write[]) {
		for (const write of writes) {
			switch (write.kind) {
				case "put":
					this.#map.set(stringkey(write.key), write.value)
					break
				case "del":
					this.#map.delete(stringkey(write.key))
					break
				default:
					throw new Error(`unknown write kind`)
			}
		}
	}
}

