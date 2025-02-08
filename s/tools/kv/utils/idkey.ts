
import {Hex, Text} from "@benev/slate"

export const idkey = (prefix: string, hexId: string) => new Uint8Array([
	...Text.bytes(prefix),
	...Hex.bytes(hexId),
])

