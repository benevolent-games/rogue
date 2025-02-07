
import {secure, Service} from "renraku"
import {Proof} from "@authlocal/authlocal"

export function secureLogin<S extends Service>(fn: (proof: Proof) => S) {
	return secure(async(proofToken: string) => {
		const options = {allowedAudiences: [window.origin]}
		const proof = await Proof.verify(proofToken, options)
		return fn(proof)
	})
}

