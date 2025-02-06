
import {secure, Service} from "renraku"
import {Proof} from "@authlocal/authlocal"
import {Keychain} from "./utils/keychain.js"
import {Accountant} from "./accounts/accountant.js"
import {Characters} from "./characters/characters.js"

export class Server {
	accountant = new Accountant()
	characters = new Characters()
	constructor(public keychain: Keychain) {}

	#secure<S extends Service>(fn: (proof: Proof) => S) {
		return secure(async(proofToken: string) => {
			const options = {allowedAudiences: [window.origin]}
			const proof = await Proof.verify(proofToken, options)
			return fn(proof)
		})
	}

	api = ({v1: {
		pubkey: async() => this.keychain.pubkeyJson,

		accounting: this.#secure(proof =>
			this.accountant.api(this.keychain, proof)
		),

		characters: this.#secure(proof =>
			this.characters.api(this.keychain, proof)
		),
	}})
}

