
import {Badge} from "@benev/slate"
import {AccountRecord} from "./types.js"
import {Kv} from "../../../packs/kv/kv.js"

export class AccountantDatabase {
	#records: Kv<AccountRecord>

	constructor(kv: Kv) {
		this.#records = kv.namespace<AccountRecord>("accounts.records")
	}

	async save(record: AccountRecord) {
		await this.#records.put(record.thumbprint, record)
	}

	async load(thumbprint: string) {
		return this.#records.guarantee<AccountRecord>(thumbprint, () => ({
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

