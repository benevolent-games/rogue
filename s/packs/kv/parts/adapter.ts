
import {Core, Write} from "./core.js"
import {Transaction} from "./transaction.js"
import {makePrefixFn, PrefixFn} from "../utils/keys.js"

export type FlexKey = string | Uint8Array
export type ToBytes<V> = (value: V) => Uint8Array
export type ToValue<V> = (bytes: Uint8Array) => V

export type AdapterOptions<V> = {
	toBytes: ToBytes<V>
	toValue: ToValue<V>
	prefix?: FlexKey
}

export class Adapter<V> {
	transaction: Transaction<V>
	#prefix: PrefixFn

	constructor(public core: Core, public options: AdapterOptions<V>) {
		this.transaction = new Transaction(options)
		this.#prefix = makePrefixFn(options.prefix)
	}


	async gets<X extends V = V>(...keys: FlexKey[]) {
		return (
			(await this.core.gets(...keys.map(f => this.#prefix(f))))
				.map(bytes => (bytes && this.options.toValue(bytes)))
		) as (X | undefined)[]
	}

	async get<X extends V = V>(key: FlexKey) {
		const [value] = await this.gets(key)
		return value as X | undefined
	}

	async requires<X extends V = V>(...keys: FlexKey[]) {
		const values = await this.gets(...keys)
		for (const value of values)
			if (value === undefined)
				throw new Error("required key not found")
		return values as X[]
	}

	async require<X extends V = V>(key: FlexKey) {
		const [value] = await this.requires(key)
		return value as X
	}

	async has(...flexkeys: FlexKey[]) {
		const keys = flexkeys.map(f => this.#prefix(f))
		return this.core.has(...keys)
	}

	async write(fn: (transaction: Transaction<V>) => Write[][]) {
		const writes = fn(this.transaction).flat()
		return this.core.transaction(...writes)
	}

	async put(key: FlexKey, value: V) {
		return this.write(t => [t.put(key, value)])
	}

	async puts(...entries: [FlexKey, V][]) {
		return this.write(t => [t.puts(...entries)])
	}

	async del(...keys: FlexKey[]) {
		return this.write(t => [t.del(...keys)])
	}

	async guarantee<X extends V = V>(key: FlexKey, make: () => X) {
		let value: X | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.write(t => [t.put(key, value!)])
		}
		return value
	}
}

