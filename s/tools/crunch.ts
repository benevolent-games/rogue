
import {Base58, Text} from "@benev/slate"

export function crunch<D>(data: D) {
	const json = JSON.stringify(data)
	const bytes = Text.bytes(json)
	return Base58.string(bytes)
}

export function uncrunch<D>(b58: string): D {
	const bytes = Base58.bytes(b58)
	const json = Text.string(bytes)
	return JSON.parse(json)
}

