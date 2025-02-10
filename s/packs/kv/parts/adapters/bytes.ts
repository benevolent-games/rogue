
import {Core} from "../core.js"
import {Adapter, FlexKey} from "../adapter.js"

export class BytesAdapter extends Adapter<Uint8Array> {
	constructor(core: Core, prefix?: FlexKey) {
		super(core, {
			prefix,
			toBytes: b => b,
			toValue: b => b,
		})
	}
}

