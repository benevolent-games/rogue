
import {Randy} from "@benev/toolbox"

// TODO
// integrate into official randy in toolbox at some point

export function randyByte(randy: Randy) {
	return randy.integerRange(0, 255)
}

export function randyBuffer(randy: Randy, bytes: number) {
	return new Uint8Array(Array(bytes).map(() => randy.integerRange(0, 255)))
}

