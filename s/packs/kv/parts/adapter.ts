
import {Core, Write} from "./core.js"
import {makeKeyFn, KeyFn} from "./keys.js"
import {Transaction} from "./transaction.js"
import {Flex, KeyOptions, ValueOptions} from "./types.js"

export type AdapterOptions<V, K extends Flex> = (
	& KeyOptions<K>
	& ValueOptions<V>
)

export class Adapter<V, K extends Flex> {
	#key: KeyFn
	#options: AdapterOptions<V, K>
	transaction: Transaction<V, K>

	constructor(public core: Core, options: AdapterOptions<V, K>) {
		this.#options = options
		this.#key = makeKeyFn(options)
		this.transaction = new Transaction(options)
	}

	async gets(...keys: Flex[]) {
		return (
			(await this.core.gets(...keys.map(f => this.#key(f))))
				.map(bytes => (bytes && this.#options.toValue(bytes)))
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

	async write(fn: (transaction: Transaction<V, K>) => Write[][]) {
		const writes = fn(this.transaction).flat()
		return this.core.transaction(...writes)
	}

	async put(key: Flex, value: V) {
		return this.write(t => [t.put(key, value)])
	}

	async puts(...entries: [Flex, V][]) {
		return this.write(t => [t.puts(...entries)])
	}

	async del(...keys: Flex[]) {
		return this.write(t => [t.del(...keys)])
	}

	async guarantee(key: Flex, make: () => V) {
		let value: V | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.write(t => [t.put(key, value!)])
		}
		return value
	}
}

