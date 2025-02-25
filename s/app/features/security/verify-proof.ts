
import {Proof} from "@authlocal/authlocal"

export async function verifyProof(proofToken: string) {
	return Proof.verify(proofToken, {allowedAudiences: [
		window.location.origin,
		"http://localhost:8080",
		"https://rogue.benevolent.games",
	]})
}

