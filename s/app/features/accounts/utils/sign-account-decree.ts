
import {Future, Proof} from "@authlocal/authlocal"

import {normalizeRecord} from "./normalize.js"
import {DecreeSigner} from "../../security/decree/signer.js"
import {Account, AccountRecord, AccountReport} from "../types.js"

export async function signAccountDecree(
		signer: DecreeSigner,
		proof: Proof,
		record: AccountRecord,
	): Promise<AccountReport> {

	record = normalizeRecord(record)

	const account: Account = {
		thumbprint: proof.thumbprint,
		name: record.preferences.name,
		tags: record.privileges.tags,
		avatarId: record.preferences.avatarId,
	}

	return {
		record,
		decree: await signer.sign<Account>(account, {expiresAt: Future.days(7)}),
	}
}

