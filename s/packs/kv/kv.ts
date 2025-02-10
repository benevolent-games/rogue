
import {Hex} from "@benev/slate"
import {Core} from "./parts/core.js"
import {MemCore} from "./cores/mem.js"
import {bytekey} from "./parts/keys.js"
import {JsonAdapter} from "./parts/adapters/json.js"
import {defaultKeyOptions} from "./parts/defaults.js"
import {BytesAdapter} from "./parts/adapters/bytes.js"
import {StringAdapter} from "./parts/adapters/string.js"
import {Flex, HexStore, KeyOptions} from "./parts/types.js"

export class Kv<V = any, K extends Flex = Flex> extends JsonAdapter<V, K> {
	options: KeyOptions<K>
	bytes: BytesAdapter<K>
	string: StringAdapter<K>

	constructor(
			public core: Core = new MemCore(),
			o: Partial<KeyOptions<K>> = {},
		) {
		const options: KeyOptions<K> = {...defaultKeyOptions, ...o}
		super(core, options)
		this.options = options
		this.bytes = new BytesAdapter(core, options)
		this.string = new StringAdapter(core, options)
	}

	#subsection(key: Flex | undefined, options: Partial<KeyOptions<K>>) {
		return {
			...this.options,
			...options,
			prefix: key && (this.options.prefix
				? bytekey(this.options.prefix, this.options.divisor, key)
				: bytekey(key)
			),
		}
	}

	/** create a kv where all keys are given a certain prefix */
	namespace<X = V>(key?: Flex, options: Partial<Omit<KeyOptions<K>, "prefix">> = {}) {
		return new Kv<X, K>(this.core, this.#subsection(key, options))
	}

	/** create a namespace where you use hex encoded ids as keys */
	hexStore<X = V>(key?: Flex, options: Partial<Omit<KeyOptions<K>, "prefix">> = {}): HexStore<X> {
		return new Kv<X, string>(this.core, {
			...this.#subsection(key, options),
			toKey: key => Hex.bytes(key),
		})
	}
}

