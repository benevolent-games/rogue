
import {Base58, Hex} from "@benev/slate"

export const Idtext = {

	from(hex: string) {
		return Base58.string(Hex.bytes(hex))
	},

	to(text: string) {
		return Hex.string(Base58.bytes(text))
	},
}

