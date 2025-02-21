
import {normalizeRecord} from "./normalize.js"
import {Account, AccountRecord} from "../types.js"

export function assembleAccount(thumbprint: string, record: AccountRecord): Account {
	record = normalizeRecord(record)
	return {
		thumbprint,
		name: record.preferences.name,
		tags: record.privileges.tags,
		avatarId: record.preferences.avatarId,
	}
}

