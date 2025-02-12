
import {Kv} from "../kv.js"

export class Store<V = any> {
	constructor(public kv: Kv, public key: string) {}

	async put(value: V) {
		await this.kv.put(this.key, value)
	}

	async get() {
		await this.kv.get(this.key)
	}

	async require() {
		await this.kv.require(this.key)
	}
}

