
import {Text} from "@benev/slate"
import {FlexKey} from "../parts/adapter.js"

export function stringkey(key: FlexKey) {
	return (typeof key === "string")
		? key
		: Text.string(key)
}

export const concatkey = (...parts: FlexKey[]) => {
	return new Uint8Array(
		parts.flatMap(part => Array.from(
			(typeof part === "string")
				? Text.bytes(part)
				: part
		))
	)
}

export function bytekey(key: FlexKey) {
	return (typeof key === "string")
		? Text.bytes(key)
		: key
}

export type PrefixFn = (...keyparts: FlexKey[]) => Uint8Array

export function makePrefixFn(prefix: FlexKey | undefined): PrefixFn {
	return (...keyparts) => prefix
		? concatkey(prefix, ...keyparts)
		: concatkey(...keyparts)
}

