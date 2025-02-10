
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

	async put(key: FlexKey, value: V) {
		return this.#core.put(
			key,
			this.#toBytes(value),
		)
	}

	async puts(...entries: [FlexKey, V][]) {
		return this.#core.puts(...entries.map(([key, value]) => [
			key,
			this.#toBytes(value),
		] as [Uint8Array, Uint8Array]))
	}

	async get(key: FlexKey) {
		const bytes = await this.#core.get(key)
		return bytes && this.#toValue(bytes)
	}

	async gets(...keys: FlexKey[]) {
		return (await this.#core.gets(...keys))
			.map(bytes => (bytes && this.#toValue(bytes)))
	}

	async require(key: FlexKey) {
		return this.#toValue(
			await this.#core.require(key)
		)
	}

	async requires(...keys: FlexKey[]) {
		return (await this.#core.requires(...keys))
			.map(bytes => this.#toValue(bytes))
	}

	async guarantee(key: FlexKey, make: () => V) {
		let value: V | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.put(key, value)
		}
		return value
	}

	async del(...keys: FlexKey[]) {
		return this.#core.del(...keys)
	}
}

