
import {KvStore} from "./store.js"
import {MemCore} from "./cores/mem.js"
import {JsonAdapter} from "./parts/json.js"
import {StringAdapter} from "./parts/string.js"
import {ByteCore, FlexKey} from "./parts/types.js"

export class Kv {
	json: JsonAdapter
	string: StringAdapter

	constructor(public bytes: ByteCore = new MemCore()) {
		this.json = new JsonAdapter(bytes)
		this.string = new StringAdapter(bytes)
	}

	store<X>(prefix: FlexKey) {
		return new KvStore<X>(this.json, prefix)
	}
}

