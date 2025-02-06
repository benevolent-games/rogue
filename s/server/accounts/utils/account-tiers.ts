
import {AccountTag} from "../types.js"

export const AccountTiers = {
	isAdmin(tags: AccountTag[]) {
		return (
			tags.includes("founder") ||
			tags.includes("blessed")
		)
	},
	isPremium(tags: AccountTag[]) {
		return (
			tags.includes("founder") ||
			tags.includes("blessed") ||
			tags.includes("knighted") ||
			tags.includes("premium")
		)
	},
}

