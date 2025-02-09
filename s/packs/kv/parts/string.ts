
import {Text} from "@benev/slate"
import {ByteCore} from "./types.js"
import {Adapter} from "./adapter.js"

export class StringAdapter extends Adapter<string> {
	constructor(core: ByteCore) {
		super(core, {
			toBytes: value => Text.bytes(value),
			toValue: bytes => Text.string(bytes),
		})
	}
}

