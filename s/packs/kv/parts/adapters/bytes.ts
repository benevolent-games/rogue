
import {Core} from "../core.js"
import {Adapter} from "../adapter.js"
import {Flex, KeyOptions} from "../types.js"

export class BytesAdapter<K extends Flex = Flex> extends Adapter<Uint8Array, K> {
	constructor(core: Core, options: KeyOptions<K>) {
		super(core, {
			valueConverter: {
				toBytes: b => b,
				fromBytes: b => b,
			},
			...options,
		})
	}
}

