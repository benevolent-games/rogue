
import {Text} from "@benev/slate"
import {Core} from "../core.js"
import {Adapter, FlexKey} from "../adapter.js"

export class JsonAdapter<V = any> extends Adapter<V> {
	constructor(core: Core, prefix?: FlexKey) {
		super(core, {
			prefix,
			toBytes: value => Text.bytes(JSON.stringify(value)),
			toValue: bytes => JSON.parse(Text.string(bytes)),
		})
	}
}

