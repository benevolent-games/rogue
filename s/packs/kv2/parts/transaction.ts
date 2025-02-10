
import {Write} from "./core.js"
import {AdapterOptions, FlexKey} from "./adapter.js"
import {makePrefixFn, PrefixFn} from "../utils/keys.js"

export class Transaction<V> {
	#options: AdapterOptions<V>
	#prefix: PrefixFn

	constructor(options: AdapterOptions<V>) {
		this.#options = options
		this.#prefix = makePrefixFn(options.prefix)
	}

	puts(...entries: [FlexKey, V][]): Write[] {
		return entries.map(([key, value]) => ({
			kind: "put",
			key: this.#prefix(key),
			value: this.#options.toBytes(value),
		}))
	}

	put(key: FlexKey, value: V): Write[] {
		return this.puts([key, value])
	}

	del(...keys: FlexKey[]): Write[] {
		return keys.map(key => ({
			kind: "del",
			key: this.#prefix(key),
		}))
	}
}

