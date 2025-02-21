
import {Badge} from "@benev/slate"
import {AccountRecord} from "./types.js"
import {DatabaseSchema} from "../schema/database.js"

export class AccountantDatabase {
	constructor(public schema: DatabaseSchema) {}

	async save(record: AccountRecord) {
		await this.schema.accounts.records.put(record.thumbprint, record)
	}

	async load(thumbprint: string) {
		return this.schema.accounts.records.guarantee<AccountRecord>(thumbprint, () => ({
			thumbprint,
			privileges: {
				tags: [],
				avatars: [],
			},
			preferences: {
				avatarId: null,
				name: Badge.fromHex(thumbprint).preview,
			},
		}))
	}
}

