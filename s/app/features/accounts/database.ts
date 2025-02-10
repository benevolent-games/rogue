
import {Badge} from "@benev/slate"
import {AccountRecord} from "./types.js"
import {Kv} from "../../../packs/kv/kv.js"
import {idkey} from "../../../packs/kv/utils/idkey.js"

export class AccountantDatabase {
	constructor(public kv: Kv) {}

	#key(thumbprint: string) {
		return idkey("accounts.records.", thumbprint)
	}

	async save(record: AccountRecord) {
		await this.kv.json.put(this.#key(record.thumbprint), record)
	}

	async load(thumbprint: string) {
		return this.kv.json.guarantee<AccountRecord>(this.#key(thumbprint), () => ({
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

