
import {byteify} from "./keys.js"
import {Flex, KeyOptions} from "./types.js"

export const defaultKeyOptions: KeyOptions<Flex> = {
	divisor: ".",
	delimiter: ":",
	keyConverter: {
		toBytes: key => byteify(key),
		fromBytes: key => byteify(key),
	},
}

