
export abstract class Core {
	abstract gets(...keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
	abstract has(...keys: Uint8Array[]): Promise<boolean>
	abstract transaction(...writes: Write[]): Promise<void>
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

