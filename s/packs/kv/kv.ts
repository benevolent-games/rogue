
import {MemCore} from "./cores/mem.js"
import {ByteCore} from "./parts/types.js"
import {JsonAdapter} from "./parts/json.js"
import {StringAdapter} from "./parts/string.js"

export class Kv {
	json: JsonAdapter
	string: StringAdapter

	constructor(public bytes: ByteCore = new MemCore()) {
		this.json = new JsonAdapter(bytes)
		this.string = new StringAdapter(bytes)
	}
}

