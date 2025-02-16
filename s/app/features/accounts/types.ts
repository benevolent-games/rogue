
/** publicly-visible roles */
export type AccountTag = "founder" | "blessed" | "knighted" | "premium" | "banned"

/** user-provided preferences about their account */
export type AccountPreferences = {
	name: string
	avatarId: string | null
}

/** account status and unlocks */
export type AccountPrivileges = {
	tags: AccountTag[]
	avatars: string[]
}

/** database record about a user's account */
export type AccountRecord = {
	thumbprint: string
	privileges: AccountPrivileges
	preferences: AccountPreferences
}

/** publicly-visible and queryable info about a user */
export type Account = {
	thumbprint: string
	name: string
	avatarId: string | null
	tags: AccountTag[]
}

export type AccountReport = {
	decree: string
	record: AccountRecord
}

