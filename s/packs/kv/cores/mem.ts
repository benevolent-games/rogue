
import {Hex} from "@benev/slate"
import {byteMatch} from "../utils/byte-match.js"
import {Core, Scan, Write} from "../parts/core.js"

const mapkey = (bytes: Uint8Array) => Hex.string(bytes)

export class MemCore extends Core {
	#map = new Map<string, Uint8Array>()

	async gets(...keys: Uint8Array[]) {
		return keys.map(key => this.#map.get(mapkey(key)))
	}

	async has(...keys: Uint8Array[]) {
		return keys.every(key => this.#map.has(mapkey(key)))
	}

	async *keys(scan: Scan = {}) {
		if (scan.limit === 0)
			return

		let count = 0
		for (const hexKey of this.#map.keys()) {
			const bytes = Hex.bytes(hexKey)
			if (byteMatch(bytes, scan))
				yield bytes
			if (++count >= (scan.limit ?? Infinity))
				break
		}
	}

	async *entries(scan: Scan = {}) {
		if (scan.limit === 0)
			return

		let count = 0
		for (const [hexKey, value] of this.#map.entries()) {
			const bytes = Hex.bytes(hexKey)
			if (byteMatch(bytes, scan))
				yield [bytes, value] as [Uint8Array, Uint8Array]
			if (++count >= (scan.limit ?? Infinity))
				break
		}
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

