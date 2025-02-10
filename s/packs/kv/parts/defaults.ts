
import {byteify} from "./keys.js"
import {Flex, KeyOptions} from "./types.js"

export const defaultKeyOptions: KeyOptions<Flex> = {
	divisor: ".",
	delimiter: ":",
	toKey: key => byteify(key),
}

