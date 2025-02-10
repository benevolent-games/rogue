
import {Avatar} from "../avatars/avatar.js"
import {AccountPrivileges} from "../types.js"
import {AccountTiers} from "./account-tiers.js"

export function isAvatarAllowed(
		avatar: Avatar,
		privileges: AccountPrivileges | undefined | null,
	) {

	if (!privileges)
		return (avatar.kind === "rando")

	if (avatar.kind === "rando" || avatar.kind === "free")
		return true

	if (avatar.kind === "premium")
		if (AccountTiers.isPremium(privileges.tags))
			return true

	if (avatar.kind === "rare")
		if (AccountTiers.isAdmin(privileges.tags))
			return true

	return privileges.avatars.includes(avatar.id)
}

