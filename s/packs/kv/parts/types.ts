
import {Kv} from "../kv.js"

export type Hexspace<V = any> = Kv<V, string>

export type Flex = string | Uint8Array

export type Converter<X> = {
	toBytes: (x: X) => Uint8Array
	fromBytes: (bytes: Uint8Array) => X
}

export type KeyOptions<K extends Flex> = {

	/** conversions of keys to bytes */
	keyConverter: Converter<K>

	/** prefix prepended onto keys for all operations */
	prefix?: Flex

	/** defines the separator between multiple prefixes */
	divisor: Flex

	/** defines the separator between the prefixes and the primary key */
	delimiter: Flex
}

export type ValueOptions<V> = {
	valueConverter: Converter<V>
}

