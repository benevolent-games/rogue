
import {Keypair, Pubkey, Token, TokenParams} from "@authlocal/authlocal"

import {Decree} from "./decree.js"
import {DecreeVerifier} from "./verifier.js"
import {obtainTempKeypair} from "./temp-keypair.js"

export class DecreeSigner extends DecreeVerifier {
	static async temp() {
		const keypair = await obtainTempKeypair()
		const pubkey = keypair.toPubkey()
		return new this(keypair, pubkey)
	}

	constructor(public keypair: Keypair, pubkey: Pubkey) {
		super(pubkey)
	}

	async sign<D>(data: D, params: TokenParams) {
		return this.keypair.sign<Decree<D>>({
			...Token.params(params),
			data,
		})
	}
}

