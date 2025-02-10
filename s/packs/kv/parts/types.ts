
export type FlexKey = string | Uint8Array

export type PutWrite = {type: "put", key: Uint8Array, value: Uint8Array}
export type DelWrite = {type: "del", key: Uint8Array, value: Uint8Array}
export type Write = PutWrite | DelWrite

export type Core = {
	gets(...keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
	has(...keys: Uint8Array[]): Promise<boolean>
	transaction(...writes: Write[]): Promise<void>
}

/////////////////////////

export type ByteCore = {
	put(key: FlexKey, value: Uint8Array): Promise<void>
	puts(...entries: [FlexKey, Uint8Array][]): Promise<void>

	get(key: FlexKey): Promise<Uint8Array | undefined>
	gets(...keys: FlexKey[]): Promise<(Uint8Array | undefined)[]>

	require(key: FlexKey): Promise<Uint8Array>
	requires(...keys: FlexKey[]): Promise<Uint8Array[]>

	guarantee(key: FlexKey, make: () => Uint8Array): Promise<Uint8Array>

	has(...keys: FlexKey[]): Promise<boolean>
	del(...keys: FlexKey[]): Promise<void>
}

export type ToValue<V> = (bytes: Uint8Array) => V
export type ToBytes<V> = (value: V) => Uint8Array

