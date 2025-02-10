
import {Text} from "@benev/slate"
import {FlexKey} from "../parts/types.js"

export const concatkey = (...parts: FlexKey[]) => {
	return new Uint8Array(
		parts.flatMap(part => Array.from(
			(typeof part === "string")
				? Text.bytes(part)
				: part
		))
	)
}

