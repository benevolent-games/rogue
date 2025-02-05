
import Sparrow from "sparrow-rtc"
import {Urname, Hex} from "@benev/slate"

/** for presenting sparrow invites to users in base58 format (sparrow natively uses hex) */
export const Invites = {

	obtainFromWindow() {
		const urname = Sparrow.invites.parse(window.location.hash)
		return urname && Hex.string(Urname.bytes(urname))
	},

	url(hex: string) {
		const bytes = Hex.bytes(hex)
		const urname = Urname.string(bytes)
		return Sparrow.invites.url(urname)
	},

	writeInviteToWindowHash(invite: string) {
		const inviteUrl = Invites.url(invite)
		history.replaceState(null, "", inviteUrl)
	},

	deleteInviteFromWindowHash() {
		history.replaceState(null, "", window.location.pathname + window.location.search)
	},
}

