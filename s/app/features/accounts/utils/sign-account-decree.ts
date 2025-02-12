
import {Future, Proof} from "@authlocal/authlocal"

import {normalizeRecord} from "./normalize.js"
import {Account, AccountRecord} from "../types.js"
import {DecreeSigner} from "../../security/decree/signer.js"

export async function signAccountDecree(
		signer: DecreeSigner,
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

	return {
		accountRecord: record,
		accountDecree: await signer.sign<Account>(account, {expiresAt: Future.days(7)}),
	}
}

