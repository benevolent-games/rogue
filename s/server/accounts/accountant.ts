
import {Future, Proof} from "@authlocal/authlocal"
import {Kv} from "../../tools/kv/kv.js"
import {Avatar} from "../avatars/avatar.js"
import {Keychain} from "../utils/keychain.js"
import {AccountantDatabase} from "./database.js"
import {secureLogin} from "../utils/secure-login.js"
import {Account, AccountPreferences} from "./types.js"
import {isAvatarAllowed} from "./utils/is-avatar-allowed.js"

export class Accountant {
	database: AccountantDatabase

	constructor(public kv: Kv, public keychain: Keychain) {
		this.database = new AccountantDatabase(kv)
	}

	api = () => secureLogin((proof: Proof) => ({
		query: async(preferences: AccountPreferences) => {
			const accountRecord = await this.database.load(proof.thumbprint)
			const avatarRequested = Avatar.library.get(preferences.avatarId) ?? Avatar.default

			const avatarActual = isAvatarAllowed(avatarRequested, accountRecord)
				? avatarRequested
				: Avatar.default

			const account: Account = {
				tags: accountRecord.tags,
				avatarId: avatarActual.id,
				thumbprint: proof.thumbprint,
				name: preferences.name,
			}

			const accountToken = await this.keychain.sign(account, Future.days(7))
			return {accountToken, accountRecord}
		},
	}))
}

