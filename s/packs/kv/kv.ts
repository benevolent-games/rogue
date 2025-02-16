
import {Core} from "./parts/core.js"
import {Data} from "./parts/data.js"
import {MemCore} from "./cores/mem.js"
import {Store} from "./parts/store.js"
import {Writer} from "./parts/writer.js"
import {Prefixer} from "./parts/prefixer.js"
import {Options, Scan, Write} from "./parts/types.js"

export class Kv<V = any> {
	write: Writer<V>
	#options: Options
	#prefixer: Prefixer

	constructor(public core: Core = new MemCore(), options: Partial<Options> = {}) {
		this.#options = {
			prefix: [],
			divisor: ".",
			delimiter: ":",
			...options,
		}
		this.#prefixer = new Prefixer(this.#options)
		this.write = new Writer(this.#prefixer)
	}

	async gets(...keys: string[]) {
		const strings = await this.core.gets(...keys.map(this.#prefixer.prefix))
		return strings.map(string => string === undefined
			? string
			: Data.parse<V>(string))
	}

	async get(key: string) {
		const [value] = await this.gets(key)
		return value
	}

	async requires(...keys: string[]) {
		const values = await this.gets(...keys)
		for (const value of values)
			if (value === undefined)
				throw new Error("required key not found")
		return values as V[]
	}

	async require(key: string) {
		const [value] = await this.requires(key)
		return value
	}

	async hasKeys(...keys: string[]) {
		return this.core.hasKeys(...keys.map(this.#prefixer.prefix))
	}

	async has(key: string) {
		const [value] = await this.hasKeys(key)
		return value
	}

	async *keys(scan: Scan = {}) {
		for await (const key of this.core.keys(this.#prefixer.scan(scan)))
			yield this.#prefixer.unprefix(key)
	}

	async *entries(scan: Scan = {}) {
		for await (const [key, value] of this.core.entries(this.#prefixer.scan(scan)))
			yield [this.#prefixer.unprefix(key), Data.parse<V>(value)] as [string, V]
	}

	async transaction(fn: (write: Writer<V>) => Write[][]) {
		const writes = fn(this.write).flat()
		return this.core.transaction(...writes)
	}

	async put(key: string, value: V) {
		return this.transaction(w => [w.put(key, value)])
	}

	async puts(...entries: [string, V][]) {
		return this.transaction(w => [w.puts(...entries)])
	}

	async del(...keys: string[]) {
		return this.transaction(w => [w.del(...keys)])
	}

	async guarantee(key: string, make: () => V) {
		let value: V | undefined = await this.get(key)
		if (value === undefined) {
			value = make()
			await this.transaction(w => [w.put(key, value!)])
		}
		return value
	}

	/** create a store which can put or get on a single key */
	store<X = V>(key: string) {
		return new Store<X>(this, key)
	}

	/** create a kv where all keys are given a certain prefix */
	namespace<X = V>(prefix: string) {
		return new Kv<X>(this.core, {
			...this.#options,
			prefix: [...this.#options.prefix, prefix],
		})
	}
}

