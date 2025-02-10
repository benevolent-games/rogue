
import {Future, Proof} from "@authlocal/authlocal"

import {normalizeRecord} from "./normalize.js"
import {Account, AccountRecord} from "../types.js"
import {Keychain} from "../../security/keychain.js"

export async function signAccountLicense(
		keychain: Keychain,
		proof: Proof,
		record: AccountRecord,
	) {

	record = normalizeRecord(record)

	const account: Account = {
		thumbprint: proof.thumbprint,
		name: record.preferences.name,
		tags: record.privileges.tags,
		avatarId: record.preferences.avatarId,
	}

	return keychain.signLicense<Account>(account, Future.days(7))
}

