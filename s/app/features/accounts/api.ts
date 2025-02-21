
import {AccountPreferences} from "./types.js"
import {AccountantDatabase} from "./database.js"
import {DatabaseSchema} from "../schema/database.js"
import {secureLogin} from "../security/secure-login.js"
import {enhanceHardcodedAccounts} from "./hardcoded.js"
import {DecreeSigner} from "../security/decree/signer.js"
import {signAccountDecree} from "./utils/sign-account-decree.js"
import {normalizePreferences, normalizeRecord} from "./utils/normalize.js"

export async function makeAccountantApi(schema: DatabaseSchema, signer: DecreeSigner) {
	const database = new AccountantDatabase(schema)
	await enhanceHardcodedAccounts(database)

	return secureLogin(proof => ({
		async saveAccount(preferences: AccountPreferences) {
			let record = await database.load(proof.thumbprint)
			record.preferences = normalizePreferences(preferences, record.privileges)
			record = normalizeRecord(record)
			await database.save(record)
			return signAccountDecree(signer, proof, record)
		},

		async loadAccount() {
			const record = normalizeRecord(await database.load(proof.thumbprint))
			return signAccountDecree(signer, proof, record)
		},
	}))
}

