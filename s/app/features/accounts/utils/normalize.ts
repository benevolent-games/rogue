
import {Avatar} from "../avatars/avatar.js"
import {isAvatarAllowed} from "./is-avatar-allowed.js"
import {AccountPreferences, AccountPrivileges, AccountRecord} from "../types.js"

export function normalizeAvatar(avatarId: string | null, privileges: AccountPrivileges) {
	const avatar = Avatar.get(avatarId)
	return isAvatarAllowed(avatar, privileges)
		? avatar
		: Avatar.default
}

export function normalizePreferences(
		preferences: AccountPreferences,
		privileges: AccountPrivileges,
	): AccountPreferences {

	return {
		name: preferences.name,
		avatarId: preferences.avatarId
			? normalizeAvatar(preferences.avatarId, privileges).id
			: null,
	}
}

export function normalizeRecord(record: AccountRecord): AccountRecord {
	return structuredClone({
		thumbprint: record.thumbprint,
		privileges: record.privileges,
		preferences: normalizePreferences(record.preferences, record.privileges),
	})
}

