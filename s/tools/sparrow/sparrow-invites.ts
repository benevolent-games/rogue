
import Sparrow from "sparrow-rtc"
import {Base58, Hex} from "@benev/slate"

/** for presenting invites to users in base58 format (sparrow natively uses hex) */
export const SparrowInvites = {

	obtainFromWindow() {
		const b58 = Sparrow.invites.parse(window.location.hash)
		return b58 && Hex.string(Base58.bytes(b58))
	},

	url(hex: string) {
		return Sparrow.invites.url(
			Base58.string(Hex.bytes(hex))
		)
	},
}

