
import {TokenPayload} from "@authlocal/authlocal"

export type AccountTag = "founder" | "blessed" | "knighted" | "premium"

export type AccountPayload = {data: Account} & TokenPayload

export type Account = {
	thumbprint: string
	name: string
	avatarId: string
	tags: AccountTag[]
}

export type AccountPreferences = {
	name: string
	avatarId: string
}

export type AccountRecord = {
	thumbprint: string
	avatarId: string | null
	tags: AccountTag[]
	avatars: string[]
}

