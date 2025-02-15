
import {Badge} from "@authlocal/authlocal"

/** for presenting sparrow invites to users in base58 format (sparrow natively uses hex) */
export const Invites = {

	obtainFromWindow() {
		const hash = window.location.hash.replace(/^#/, "")
		const result = hash.match(/^\/invite\/(.+)$/i)
		return result && Badge.parse(result.at(1)!).hex
	},

	url(hex: string) {
		const code = Badge.fromHex(hex, 2).string
		return `#/invite/${code}`
	},

	writeInviteToWindowHash(invite: string) {
		const inviteUrl = Invites.url(invite)
		history.replaceState(null, "", inviteUrl)
	},

	deleteInviteFromWindowHash() {
		history.replaceState(null, "", window.location.pathname + window.location.search)
	},
}

