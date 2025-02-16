
import {secure, Service} from "renraku"
import {Proof} from "@authlocal/authlocal"

export function secureLogin<S extends Service>(fn: (proof: Proof) => S) {
	return secure(async({proofToken}: {proofToken: string}) => {
		const proof = await Proof.verify(proofToken, {allowedAudiences: [
			"http://localhost:8080",
			"https://rogue.benevolent.games",
		]})
		return fn(proof)
	})
}

