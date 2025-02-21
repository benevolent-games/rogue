
import {secure, Service} from "renraku"
import {Proof} from "@authlocal/authlocal"
import {verifyProof} from "./verify-proof.js"

/** secure a group of api functions, verifying that an authlocal passport proof is provided */
export function secureLogin<S extends Service>(fn: (proof: Proof) => S) {
	return secure(
		async({proofToken}: {proofToken: string}) =>
			fn(await verifyProof(proofToken))
	)
}

