
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"

export class HashMap<Key, Value> {
	#map = new Map2<string, [Key, Value]>

	constructor(
			private hash: (x: Key) => string,
			entries: [Key, Value][] = [],
		) {
		for (const [key, value] of entries)
			this.set(key, value)
	}

	get size() {
		return this.#map.size
	}

	get(key: Key) {
		const result = this.#map.get(this.hash(key))
		if (result)
			return result[1]
	}

	has(key: Key) {
		return this.#map.has(this.hash(key))
	}

	set(key: Key, value: Value) {
		this.#map.set(this.hash(key), [key, value])
		return this
	}

	delete(...keys: Key[]) {
		for (const key of keys)
			this.#map.delete(this.hash(key))
		return this
	}

	entries() {
		return this.#map.values()
	}

	*keys() {
		for (const [key] of this.#map.values())
			yield key
	}

	*values() {
		for (const [,value] of this.#map.values())
			yield value
	}

	array() {
		return [...this.entries()]
	}

	yoink(randy: Randy) {
		return randy.yoink(this.array())
	}

	guarantee(key: Key, fn: () => Value) {
		return this.#map.guarantee(this.hash(key), () => [key, fn()])
	}

	/** @deprecated use .array() instead */
	list() {
		return this.array()
	}
}

