
import {Decree} from "./decree.js"
import {Pubkey, TokenVerifyOptions} from "@authlocal/authlocal"

export class DecreeVerifier {
	constructor(public pubkey: Pubkey) {}

	async verify<D>(decree: string, options: TokenVerifyOptions = {}) {
		return (await this.pubkey.verify<Decree<D>>(decree, options)).data
	}
}

