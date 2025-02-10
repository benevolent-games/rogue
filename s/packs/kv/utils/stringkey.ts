
import {Text} from "@benev/slate"
import {FlexKey} from "../parts/types.js"

export function stringkey(key: FlexKey) {
	return (typeof key === "string")
		? key
		: Text.string(key)
}

