
import {FlexKey} from "./parts/types.js"
import {JsonAdapter} from "./parts/json.js"
import {concatkey} from "./utils/concatkey.js"

export class KvStore<X> {
	constructor(
		public json: JsonAdapter,
		public prefix: FlexKey,
		public delimiter = ":",
	) {}

	#key(hexId: string) {
		return concatkey(this.prefix + this.delimiter, hexId)
	}

	async put(hexId: string, value: X) {
		const key = this.#key(hexId)
		await this.json.put(key, value)
	}

	async puts(...entries: [string, X][]) {
		await this.json.puts(
			...entries.map(
				([hexId, value]) =>
					[this.#key(hexId), value] as [FlexKey, X]
			)
		)
	}

	async get(hexId: string) {
		const key = this.#key(hexId)
		return this.json.get<X>(key)
	}

	async gets(...hexIds: string[]) {
		return this.json.gets<X>(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}

	async require(hexId: string) {
		const key = this.#key(hexId)
		return this.json.require<X>(key)
	}

	async requires(...hexIds: string[]) {
		return this.json.requires<X>(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}

	async guarantee(hexId: string, make: () => X) {
		const key = this.#key(hexId)
		return this.json.guarantee<X>(key, make)
	}

	async has(...hexIds: string[]) {
		return this.json.has(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}

	async del(...hexIds: string[]) {
		return this.json.del(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}
}

