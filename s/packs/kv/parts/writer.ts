
import {Write} from "./core.js"
import {Flex} from "./types.js"
import {makeKeyFn, KeyFn} from "./keys.js"
import {AdapterOptions} from "./adapter.js"

export class Writer<V, K extends Flex> {
	#key: KeyFn
	#options: AdapterOptions<V, K>

	constructor(options: AdapterOptions<V, K>) {
		this.#options = options
		this.#key = makeKeyFn(options)
	}

	puts(...entries: [Flex, V][]): Write[] {
		return entries.map(([key, value]) => ({
			kind: "put",
			key: this.#key(key),
			value: this.#options.toBytes(value),
		}))
	}

	put(key: Flex, value: V): Write[] {
		return this.puts([key, value])
	}

	del(...keys: Flex[]): Write[] {
		return keys.map(key => ({
			kind: "del",
			key: this.#key(key),
		}))
	}
}

