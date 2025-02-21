
import {secure, Service} from "renraku"
import {Proof} from "@authlocal/authlocal"
import {verifyProof} from "./verify-proof.js"
import {AccountKind} from "../accounts/types.js"

/** secure a group of api functions, verifying that an authlocal passport proof is provided */
export function secureLogin<S extends Service>(fn: (proof: Proof, kind: AccountKind) => S) {
	return secure(
		async({proofToken, kind}: {proofToken: string, kind: AccountKind}) =>
			fn(await verifyProof(proofToken), kind)
	)
}

