
import {Text} from "@benev/slate"
import {Core} from "../core.js"
import {Adapter, FlexKey} from "../adapter.js"

export class StringAdapter extends Adapter<string> {
	constructor(core: Core, prefix?: FlexKey) {
		super(core, {
			prefix,
			toBytes: value => Text.bytes(value),
			toValue: bytes => Text.string(bytes),
		})
	}
}

