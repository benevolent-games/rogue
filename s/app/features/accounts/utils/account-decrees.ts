
import {Future, Proof} from "@authlocal/authlocal"
import {Account, AccountRecord, AccountReport} from "../types.js"
import {assembleAccount} from "./assemble-account.js"
import {DecreeSigner} from "../../security/decree/signer.js"
import {DecreeVerifier} from "../../security/decree/verifier.js"

export const AccountDecrees = {

	/** sign an account decree, that indicates a user has an identity (be it a real login, or a rando-account) */
	async sign(signer: DecreeSigner, account: Account) {
		return signer.sign<Account>(account, {expiresAt: Future.days(7)})
	},

	/** verify a user's account */
	async verify(verifier: DecreeVerifier, decree: string) {
		return verifier.verify<Account>(decree)
	},

	// helpers

	async signAccountReport(
			signer: DecreeSigner,
			proof: Proof,
			accountRecord: AccountRecord,
		): Promise<AccountReport> {
		const account = assembleAccount(proof.thumbprint, accountRecord)
		const accountDecree = await AccountDecrees.sign(signer, account)
		return {accountRecord, accountDecree}
	},
}

