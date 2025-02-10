
import {Kv} from "./kv.js"
import {idkey} from "./utils/idkey.js"

export class KvStore<X> {
	constructor(public kv: Kv, public prefix: string) {}

	#key(hexId: string) {
		return idkey(this.prefix, hexId)
	}

	async put(hexId: string, value: X) {
		const key = this.#key(hexId)
		await this.kv.json.put(key, value)
	}

	async get(hexId: string) {
		const key = this.#key(hexId)
		return this.kv.json.get<X>(key)
	}

	async require(hexId: string) {
		const key = this.#key(hexId)
		return this.kv.json.require<X>(key)
	}

	async guarantee(hexId: string, make: () => X) {
		const key = this.#key(hexId)
		return this.kv.json.guarantee<X>(key, make)
	}

	async delete(hexId: string) {
		const key = this.#key(hexId)
		return this.kv.json.del(key)
	}
}

