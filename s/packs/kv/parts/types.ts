
import {Kv} from "../kv.js"

export type Hexspace<V = any> = Kv<V, string>

export type Flex = string | Uint8Array

export type ToKey<K extends Flex> = (key: K) => Uint8Array
export type ToBytes<V> = (value: V) => Uint8Array
export type ToValue<V> = (bytes: Uint8Array) => V

export type KeyOptions<K extends Flex> = {

	/** function to convert keys into bytes */
	toKey: ToKey<K>

	/** prefix prepended onto keys for all operations */
	prefix?: Flex

	/** defines the separator between multiple prefixes */
	divisor: Flex

	/** defines the separator between the prefixes and the primary key */
	delimiter: Flex
}

export type ValueOptions<V> = {
	toBytes: ToBytes<V>
	toValue: ToValue<V>
}

