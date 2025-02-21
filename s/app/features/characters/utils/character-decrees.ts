
import {Future} from "@authlocal/authlocal"
import {DecreeSigner} from "../../security/decree/signer.js"
import {DecreeVerifier} from "../../security/decree/verifier.js"
import {CharacterAccess, CharacterRecord, CharacterScope} from "../types.js"

export const CharacterDecrees = {

	async sign(signer: DecreeSigner, character: CharacterRecord, scope: CharacterScope, days: number) {
		return signer.sign<CharacterAccess>(
			{character, scope},
			{expiresAt: Future.days(days)},
		)
	},

	async verify(verifier: DecreeVerifier, decree: string, scope: CharacterScope) {
		const access = await verifier.verify<CharacterAccess>(decree)
		if (access.scope !== scope)
			throw new Error(`character access scope "${scope}" required (got "${access.scope}")`)
		return access.character
	},

	// helpers

	async signForCustodian(signer: DecreeSigner, character: CharacterRecord) {
		return CharacterDecrees.sign(signer, character, "custodian", 7)
	},

	async signForArbiter(signer: DecreeSigner, character: CharacterRecord) {
		return CharacterDecrees.sign(signer, character, "arbiter", 1)
	},
}

