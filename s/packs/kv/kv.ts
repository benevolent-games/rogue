
import {Core} from "./parts/core.js"
import {MemCore} from "./cores/mem.js"
import {FlexKey} from "./parts/adapter.js"
import {JsonAdapter} from "./parts/adapters/json.js"
import {BytesAdapter} from "./parts/adapters/bytes.js"
import {StringAdapter} from "./parts/adapters/string.js"

export class Kv extends JsonAdapter {
	bytes: BytesAdapter
	string: StringAdapter

	constructor(core: Core = new MemCore()) {
		super(core)
		this.bytes = new BytesAdapter(core)
		this.string = new StringAdapter(core)
	}

	store<V>(prefix: FlexKey) {
		return new JsonAdapter<V>(this.core, prefix)
	}
}

