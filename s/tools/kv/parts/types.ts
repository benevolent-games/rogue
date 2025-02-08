
import {JsonAdapter} from "./json.js"
import {StringAdapter} from "./string.js"

export type FlexKey = string | Uint8Array

export type ByteCore = {
	put(key: Uint8Array, value: Uint8Array): Promise<void>
	get(key: Uint8Array): Promise<Uint8Array | undefined>
	require(key: FlexKey): Promise<Uint8Array>
	guarantee(key: FlexKey, make: () => Uint8Array): Promise<Uint8Array>
	del(key: Uint8Array): Promise<void>
}

export type Kv = {
	bytes: ByteCore
	string: StringAdapter
	json: JsonAdapter
}

export type ToValue<V> = (bytes: Uint8Array) => V
export type ToBytes<V> = (value: V) => Uint8Array

