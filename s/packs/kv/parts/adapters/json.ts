
import {Text} from "@benev/slate"
import {Core} from "../core.js"
import {Adapter} from "../adapter.js"
import {Flex, KeyOptions} from "../types.js"

export class JsonAdapter<V, K extends Flex = Flex> extends Adapter<V, K> {
	constructor(core: Core, options: KeyOptions<K>) {
		super(core, {
			toBytes: value => Text.bytes(JSON.stringify(value)),
			toValue: bytes => JSON.parse(Text.string(bytes)),
			...options,
		})
	}
}

