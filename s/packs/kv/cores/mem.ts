
import {Hex, Map2} from "@benev/slate"
import {Core, Write} from "../parts/core.js"

const mapkey = (bytes: Uint8Array) => Hex.string(bytes)

export class MemCore extends Core {
	#map = new Map2<string, Uint8Array>()

	async gets(...keys: Uint8Array[]) {
		return keys.map(key => this.#map.get(mapkey(key)))
	}

	async has(...keys: Uint8Array[]) {
		return keys.every(key => this.#map.has(mapkey(key)))
	}

	async transaction(...writes: Write[]) {
		for (const write of writes) {
			switch (write.kind) {
				case "put":
					this.#map.set(mapkey(write.key), write.value)
					break
				case "del":
					this.#map.delete(mapkey(write.key))
					break
				default:
					throw new Error(`unknown write kind`)
			}
		}
	}
}

