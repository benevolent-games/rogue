
import {Text} from "@benev/slate"
import {ByteCore, FlexKey, ToBytes, ToValue} from "./types.js"

export class Adapter<V> {
	#core: ByteCore
	#toValue: ToValue<V>
	#toBytes: ToBytes<V>

	constructor(core: ByteCore, options: {
			toValue: ToValue<V>
			toBytes: ToBytes<V>
		}) {
		this.#core = core
		this.#toValue = options.toValue
		this.#toBytes = options.toBytes
	}

	#bytekey(key: FlexKey): Uint8Array {
		return (typeof key === "string")
			? Text.bytes(key)
			: key
	}

	async put(key: FlexKey, value: V) {
		return this.#core.put(
			this.#bytekey(key),
			this.#toBytes(value),
		)
	}

	async get(key: FlexKey) {
		const bytes = await this.#core.get(this.#bytekey(key))
		return bytes && this.#toValue(bytes)
	}

	async require(key: FlexKey) {
		return this.#toValue(
			await this.#core.require(this.#bytekey(key))
		)
	}

	async guarantee(key: FlexKey, make: () => V) {
		let value: V | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			this.put(key, value)
		}
		return value
	}

	async del(key: FlexKey) {
		return this.#core.del(this.#bytekey(key))
	}
}

