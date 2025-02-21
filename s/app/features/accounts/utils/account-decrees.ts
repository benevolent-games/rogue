
import {Future, Proof} from "@authlocal/authlocal"
import {normalizeRecord} from "./normalize.js"
import {Account, AccountRecord} from "../types.js"
import {DecreeSigner} from "../../security/decree/signer.js"
import {DecreeVerifier} from "../../security/decree/verifier.js"

export const AccountDecrees = {

	/** sign an account decree, that indicates a user has an identity (be it a real login, or a rando-account) */
	async sign(signer: DecreeSigner, proof: Proof, record: AccountRecord) {
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
	},

	/** verify a user's account */
	async verify(verifier: DecreeVerifier, decree: string) {
		return verifier.verify<Account>(decree)
	},
}

