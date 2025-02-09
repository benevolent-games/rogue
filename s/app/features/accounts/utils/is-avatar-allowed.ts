
import {AccountRecord} from "../types.js"
import {Avatar} from "../../../../server/avatars/avatar.js"
import {AccountTiers} from "./account-tiers.js"

export function isAvatarAllowed(
		avatar: Avatar,
		accountRecord: AccountRecord | undefined,
	) {

	if (!accountRecord)
		return (avatar.kind === "rando")

	if (avatar.kind === "rando" || avatar.kind === "free")
		return true

	if (avatar.kind === "premium")
		if (AccountTiers.isPremium(accountRecord.tags))
			return true

	if (avatar.kind === "rare")
		if (AccountTiers.isAdmin(accountRecord.tags))
			return true

	return accountRecord.avatars.includes(avatar.id)
}

