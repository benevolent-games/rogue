
import {Writer} from "./writer.js"
import {makeKeyFn, KeyFn} from "./keys.js"
import {Core, Scan, Write} from "./core.js"
import {Flex, KeyOptions, ValueOptions} from "./types.js"

export type AdapterOptions<V, K extends Flex> = (
	& KeyOptions<K>
	& ValueOptions<V>
)

export class Adapter<V, K extends Flex> {
	#key: KeyFn
	#options: AdapterOptions<V, K>
	write: Writer<V, K>

	constructor(public core: Core, options: AdapterOptions<V, K>) {
		this.#options = options
		this.#key = makeKeyFn(options)
		this.write = new Writer(options)
	}

	async gets(...keys: Flex[]) {
		return (
			(await this.core.gets(...keys.map(f => this.#key(f))))
				.map(bytes => (bytes && this.#options.valueConverter.fromBytes(bytes)))
		) as (V | undefined)[]
	}

	async get(key: Flex) {
		const [value] = await this.gets(key)
		return value as V | undefined
	}

	async requires(...keys: Flex[]) {
		const values = await this.gets(...keys)
		for (const value of values)
			if (value === undefined)
				throw new Error("required key not found")
		return values as V[]
	}

	async require(key: Flex) {
		const [value] = await this.requires(key)
		return value as V
	}

	async has(...flexkeys: Flex[]) {
		const keys = flexkeys.map(f => this.#key(f))
		return this.core.has(...keys)
	}

	async *keys(scan: Scan = {}) {
		for await (const key of this.core.keys(scan))
			yield this.#options.keyConverter.fromBytes(key)
	}

	async *entries(scan: Scan = {}) {
		for await (const [key, value] of this.core.entries(scan))
			yield [
				this.#options.keyConverter.fromBytes(key),
				this.#options.valueConverter.fromBytes(value),
			] as [K, V]
	}

	async transaction(fn: (write: Writer<V, K>) => Write[][]) {
		const writes = fn(this.write).flat()
		return this.core.transaction(...writes)
	}

	async put(key: Flex, value: V) {
		return this.transaction(t => [t.put(key, value)])
	}

	async puts(...entries: [Flex, V][]) {
		return this.transaction(t => [t.puts(...entries)])
	}

	async del(...keys: Flex[]) {
		return this.transaction(t => [t.del(...keys)])
	}

	async guarantee(key: Flex, make: () => V) {
		let value: V | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.transaction(t => [t.put(key, value!)])
		}
		return value
	}
}

