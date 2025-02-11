
import {Core} from "./parts/core.js"
import {Data} from "./parts/data.js"
import {Writer} from "./parts/writer.js"
import {Prefixer} from "./parts/prefixer.js"
import {Options, Scan, Write} from "./parts/types.js"

export class Kv<V = any> {
	write: Writer<V>
	#options: Options
	#prefixer: Prefixer

	constructor(public core: Core, options: Partial<Options> = {}) {
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

	async has(...keys: string[]) {
		return this.core.has(...keys.map(this.#prefixer.prefix))
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

	/** create a kv where all keys are given a certain prefix */
	namespace<X = V>(prefix: string) {
		return new Kv<X>(this.core, {
			...this.#options,
			prefix: [prefix, ...this.#options.prefix],
		})
	}
}

