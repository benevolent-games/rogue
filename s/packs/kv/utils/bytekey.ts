
import {Text} from "@benev/slate"
import {FlexKey} from "../parts/types.js"

export function bytekey(key: FlexKey) {
	return (typeof key === "string")
		? Text.bytes(key)
		: key
}

