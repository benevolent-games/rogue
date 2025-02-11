
export abstract class Core {
	abstract gets(...keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
	abstract has(...keys: Uint8Array[]): Promise<boolean>
	abstract keys(scan?: Scan): AsyncGenerator<Uint8Array>
	abstract entries(scan?: Scan): AsyncGenerator<[Uint8Array, Uint8Array]>
	abstract transaction(...writes: Write[]): Promise<void>
}

export type Scan = {
	start?: Uint8Array
	end?: Uint8Array
	limit?: number
}

export type PutWrite = {
	kind: "put"
	key: Uint8Array
	value: Uint8Array
}

export type DelWrite = {
	kind: "del"
	key: Uint8Array
}

export type Write = PutWrite | DelWrite

