
import Sparrow from "sparrow-rtc"
import {Badge} from "@authlocal/authlocal"

/** for presenting sparrow invites to users in base58 format (sparrow natively uses hex) */
export const Invites = {

	obtainFromWindow() {
		const code = Sparrow.invites.parse(window.location.hash)
		return code && Badge.parse(code).hex
	},

	url(hex: string) {
		const code = Badge.fromHex(hex, 2).string
		return Sparrow.invites.url(code)
	},

	writeInviteToWindowHash(invite: string) {
		const inviteUrl = Invites.url(invite)
		history.replaceState(null, "", inviteUrl)
	},

	deleteInviteFromWindowHash() {
		history.replaceState(null, "", window.location.pathname + window.location.search)
	},
}

