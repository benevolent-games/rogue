
import {Kv} from "./kv.js"
import {idkey} from "./utils/idkey.js"
import {FlexKey} from "./parts/types.js"

export class KvStore<X> {
	constructor(public kv: Kv, public prefix: string) {}

	#key(hexId: string) {
		return idkey(this.prefix, hexId)
	}

	async put(hexId: string, value: X) {
		const key = this.#key(hexId)
		await this.kv.json.put(key, value)
	}

	async puts(...entries: [string, X][]) {
		await this.kv.json.puts(
			...entries.map(
				([hexId, value]) =>
					[this.#key(hexId), value] as [FlexKey, X]
			)
		)
	}

	async get(hexId: string) {
		const key = this.#key(hexId)
		return this.kv.json.get<X>(key)
	}

	async gets(...hexIds: string[]) {
		return this.kv.json.gets<X>(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}

	async require(hexId: string) {
		const key = this.#key(hexId)
		return this.kv.json.require<X>(key)
	}

	async requires(...hexIds: string[]) {
		return this.kv.json.requires<X>(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}

	async guarantee(hexId: string, make: () => X) {
		const key = this.#key(hexId)
		return this.kv.json.guarantee<X>(key, make)
	}

	async del(...hexIds: string[]) {
		return this.kv.json.del(
			...hexIds.map(hexId => this.#key(hexId))
		)
	}
}

