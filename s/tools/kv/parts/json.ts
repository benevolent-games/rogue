
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

	async get<V = any>(key: FlexKey): Promise<V | undefined> {
		return super.get(key)
	}

	async require<V = any>(key: FlexKey): Promise<V> {
		return super.require(key)
	}

	async guarantee<V>(key: FlexKey, make: () => V): Promise<V> {
		return super.guarantee(key, make)
	}
}

