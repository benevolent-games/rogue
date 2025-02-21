
export type Options = {
	prefix: string[]
	divisor: string
	delimiter: string
}

export type Scan = {
	start?: string
	end?: string
	limit?: number
}

export type PutWrite = {
	kind: "put"
	key: string
	value: string
}

export type DelWrite = {
	kind: "del"
	key: string
}

export type Write = PutWrite | DelWrite

