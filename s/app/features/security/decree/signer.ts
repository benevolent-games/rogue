
import {Keypair, Token, TokenParams} from "@authlocal/authlocal"

import {Decree} from "./decree.js"
import {DecreeVerifier} from "./verifier.js"

export class DecreeSigner extends DecreeVerifier {
	constructor(public keypair: Keypair) {
		super(keypair.toPubkey())
	}

	async sign<D>(data: D, params: TokenParams) {
		return this.keypair.sign<Decree<D>>({
			...Token.params(params),
			data,
		})
	}
}

