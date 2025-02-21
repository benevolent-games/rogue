
import {AccountPreferences} from "./types.js"
import {AccountantDatabase} from "./database.js"
import {DatabaseSchema} from "../schema/database.js"
import {secureLogin} from "../security/secure-login.js"
import {enhanceHardcodedAccounts} from "./hardcoded.js"
import {DecreeSigner} from "../security/decree/signer.js"
import {AccountDecrees} from "./utils/account-decrees.js"
import {addAccountTags} from "./utils/add-account-tags.js"
import {normalizePreferences, normalizeRecord} from "./utils/normalize.js"

export async function makeAccountantApi(schema: DatabaseSchema, signer: DecreeSigner) {
	const database = new AccountantDatabase(schema)
	await enhanceHardcodedAccounts(database)

	return secureLogin((proof, kind) => ({
		async saveAccount(preferences: AccountPreferences) {
			let record = await database.load(proof.thumbprint)
			record.preferences = normalizePreferences(preferences, record.privileges)
			record = normalizeRecord(record)
			if (kind === "rando") addAccountTags(record, "rando")
			await database.save(record)
			return AccountDecrees.sign(signer, proof, record)
		},

		async loadAccount() {
			const record = normalizeRecord(await database.load(proof.thumbprint))
			if (kind === "rando" && !record.privileges.tags.includes("rando")) {
				addAccountTags(record, "rando")
				await database.save(record)
			}
			return AccountDecrees.sign(signer, proof, record)
		},
	}))
}

