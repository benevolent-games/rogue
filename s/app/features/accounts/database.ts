
import {Kv} from "../../../packs/kv/kv.js"
import {AccountRecord} from "./types.js"
import {idkey} from "../../../packs/kv/utils/idkey.js"

export class AccountantDatabase {
	constructor(public kv: Kv) {}

	async save(record: AccountRecord) {
		const key = idkey("accounts.records.", record.thumbprint)
		await this.kv.json.put(key, record)
	}

	async load(thumbprint: string) {
		const key = idkey("accounts.records.", thumbprint)
		return this.kv.json.guarantee<AccountRecord>(key, () => ({
			thumbprint,
			tags: [],
			avatars: [],
			avatarId: null,
		}))
	}
}

