
import {concatkey} from "../utils/keys.js"
import {FlexKey} from "./adapter.js"
import {JsonAdapter} from "./adapters/json.js"

export class Store<X> {
	constructor(
		public json: JsonAdapter,
		public prefix: FlexKey,
		public delimiter = ":",
	) {}

	#key(hexId: string) {
		return concatkey(this.prefix + this.delimiter, hexId)
	}
}

