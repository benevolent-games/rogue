
import {Proof} from "@authlocal/authlocal"
import {Avatar} from "../avatars/avatar.js"
import {Keychain} from "../utils/keychain.js"
import {AccountantDatabase} from "./database.js"
import {Account, AccountPreferences} from "./types.js"
import {isAvatarAllowed} from "./utils/is-avatar-allowed.js"

export class Accountant {
	database = new AccountantDatabase()

	api = (keychain: Keychain, proof: Proof) => ({
		query: async(preferences: AccountPreferences) => {
			const accountRecord = await this.database.getRecord(proof.thumbprint)
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

			const accountToken = await keychain.sign(account)
			return {accountToken, accountRecord}
		},
	})
}

