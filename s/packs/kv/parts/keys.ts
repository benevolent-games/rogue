
import {Text} from "@benev/slate"
import {Flex, KeyOptions} from "./types.js"

export const bytekey = (...parts: Flex[]) => {
	return new Uint8Array(
		parts.flatMap(part => Array.from(
			(typeof part === "string")
				? Text.bytes(part)
				: part
		))
	)
}

export type KeyFn = (key: Flex) => Uint8Array

export function makeKeyFn(options: KeyOptions<any>): KeyFn {
	return key => options.prefix
		? bytekey(options.prefix, options.delimiter, options.toKey(key))
		: bytekey(options.toKey(key))
}

