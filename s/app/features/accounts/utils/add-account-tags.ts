
import {AccountRecord, AccountTag} from "../types.js"

export function addAccountTags(record: AccountRecord, ...tags: AccountTag[]) {
	const set = new Set(record.privileges.tags)

	for (const tag of tags)
		set.add(tag)

	record.privileges.tags = [...set]
}

