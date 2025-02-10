
import {Kv} from "../../../packs/kv/kv.js"
import {AccountPreferences} from "./types.js"
import {Keychain} from "../security/keychain.js"
import {AccountantDatabase} from "./database.js"
import {secureLogin} from "../security/secure-login.js"
import {enhanceHardcodedAccounts} from "./hardcoded.js"
import {signAccountLicense} from "./utils/sign-account-license.js"
import {normalizePreferences, normalizeRecord} from "./utils/normalize.js"

export async function makeAccountantApi(kv: Kv, keychain: Keychain) {
	const database = new AccountantDatabase(kv)
	await enhanceHardcodedAccounts(database)

	return secureLogin(proof => ({

		async saveAccount(preferences: AccountPreferences) {
			const record = await database.load(proof.thumbprint)
			record.preferences = normalizePreferences(preferences, record.privileges)
			return signAccountLicense(keychain, proof, record)
		},

		async loadAccount() {
			const record = normalizeRecord(await database.load(proof.thumbprint))
			return signAccountLicense(keychain, proof, record)
		},
	}))
}

