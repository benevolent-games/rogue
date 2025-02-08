
import {Text} from "@benev/slate"
import {Adapter} from "./adapter.js"
import {ByteCore, FlexKey} from "./types.js"

export class JsonAdapter extends Adapter<any> {
	constructor(core: ByteCore) {
		super(core, {
			toBytes: value => Text.bytes(JSON.stringify(value)),
			toValue: bytes => JSON.parse(Text.string(bytes)),
		})
	}

	async require<V = any>(key: FlexKey): Promise<V> {
		return super.require(key)
	}

	async get<V = any>(key: FlexKey): Promise<V | undefined> {
		return super.get(key)
	}
}

