
import {Text} from "@benev/slate"
import {Core} from "../core.js"
import {Adapter} from "../adapter.js"
import {Flex, KeyOptions} from "../types.js"

export class StringAdapter<K extends Flex = Flex> extends Adapter<string, K> {
	constructor(core: Core, options: KeyOptions<K>) {
		super(core, {
			toBytes: value => Text.bytes(value),
			toValue: bytes => Text.string(bytes),
			...options,
		})
	}
}

